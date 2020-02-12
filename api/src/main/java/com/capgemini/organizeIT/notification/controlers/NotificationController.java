package com.capgemini.organizeIT.notification.controlers;

import com.capgemini.organizeIT.notification.entities.Notification;
import com.capgemini.organizeIT.notification.mappers.NotificationMapper;
import com.capgemini.organizeIT.notification.model.NotificationDto;
import com.capgemini.organizeIT.notification.services.NotificationService;
import com.capgemini.organizeIT.permission.entities.Permission;
import com.capgemini.organizeIT.permission.mappers.PermissionMapper;
import com.capgemini.organizeIT.permission.model.PermissionDto;
import com.capgemini.organizeIT.permission.services.PermissionService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@RestController
@CrossOrigin
@RequiredArgsConstructor
public class NotificationController {
    private static final String AUTHENTICATION_KEY = "key=AAAAB-QRAc8:APA91bGFG3j-yLpZkMqzyVFJMLr5vwPLnr2ibds7RJezgRRjECsbF_AWhZn5Qdm7eIXIh06AmHIdLmNesBhiORLKM6T0OyxzkNzZsPzjRzR7WLzkG1q-2TlcanpWpSObA_4SgBuU-rgQ";
    private static final String GOOGLE_API_URL = "https://fcm.googleapis.com/fcm/send";
    private static final String TOPIC_REGISTRATION_URL = "https://iid.googleapis.com/iid/v1:batchAdd";
    private static final String APPLICATION_JSON = "application/json";
    private final PermissionService permissionService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final PermissionMapper permissionMapper;
    private final NotificationMapper notificationMapper;

    @PostMapping("/api/notifications/permissions/{userId}")
    public PermissionDto register(@RequestBody PermissionDto permissionDto, @PathVariable Long userId) {
        Permission permission = permissionMapper.convertToEntity(permissionDto);
        User user = userService.findById(userId);
        permission.setHolder(user);
        registerTokenToTopic(Set.of(permission.getToken()), user.getId());
        log.info(permission);
        return permissionMapper.convertToDto(permissionService.save(permission));
    }

    @PostMapping("/api/notifications/{userId}")
    public NotificationDto sendNotificationToUser(@RequestBody Map<String, String> notificationJson, @PathVariable Long userId) {
        User recipient = userService.findById(userId);
        log.info("Sending notification to: {}", recipient.getEmail());
        sendNotificationWithBodyToRecipient(notificationJson, "/topics/" + recipient.getId());
        Notification notification = new Notification();
        notification.setTitle(notificationJson.get("title"));
        notification.setBody(notificationJson.get("body"));
        notification.setRecipient(recipient);
        return notificationMapper.convertToDto(notificationService.save(notification));
    }

    @GetMapping("/api/notifications/{userId}")
    public Set<NotificationDto> getNotificationsForUser(@PathVariable final Long userId) {
        return notificationService.findByUserId(userId).stream().map(notificationMapper::convertToDto).collect(Collectors.toSet());
    }

    // TODO: Move below methods to service?

    /**
     * Method used to send notification to certain token or topic passed as recipient parameter
     *
     * @param body      json notification body
     * @param recipient token or certain topic to send notification to
     */
    private void sendNotificationWithBodyToRecipient(Map<String, String> body, String recipient) {
        JSONObject requestJson = new JSONObject();
        requestJson.put("notification", body);
        requestJson.put("to", recipient);
        log.info(requestJson);
        try {
            postRequestToUrlWithAuthorization(requestJson, GOOGLE_API_URL);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            log.error(e);
        }
    }

    private void postRequestToUrlWithAuthorization(JSONObject requestJson, String url) throws URISyntaxException, IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI(url))
                // TODO: Store key in some secret place
                .header("Authorization", AUTHENTICATION_KEY)
                .header("Content-Type", APPLICATION_JSON)
                .POST(HttpRequest.BodyPublishers.ofString(requestJson.toString()))
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        log.info(response.body());
    }


    private void registerTokenToTopic(Set<String> tokens, Long userId) {
        JSONObject requestJson = new JSONObject();
        requestJson.put("to", "/topics/" + userId);
        requestJson.put("registration_tokens", tokens);
        log.info(requestJson);
        try {
            postRequestToUrlWithAuthorization(requestJson, TOPIC_REGISTRATION_URL);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            log.error(e);
        }
    }
}
