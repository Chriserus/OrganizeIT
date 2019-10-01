package com.capgemini.organizeIT.notification.controlers;

import com.capgemini.organizeIT.permission.entities.Permission;
import com.capgemini.organizeIT.permission.services.PermissionService;
import com.capgemini.organizeIT.user.entities.User;
import com.capgemini.organizeIT.user.services.UserService;
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

@Log4j2
@RestController
@CrossOrigin
public class NotificationController {
    private static final String AUTHENTICATION_KEY = "key=";
    private static final String GOOGLE_API_URL = "https://fcm.googleapis.com/fcm/send";
    private static final String TOPIC_REGISTRATION_URL = "https://iid.googleapis.com/iid/v1:batchAdd";
    private static final String APPLICATION_JSON = "application/json";
    private final PermissionService permissionService;
    private final UserService userService;

    public NotificationController(final PermissionService permissionService, final UserService userService) {
        this.permissionService = permissionService;
        this.userService = userService;
    }

    @PostMapping(value = "/api/permissions/{userEmail}/", consumes = "application/json", produces = "application/json")
    public Permission register(@RequestBody Permission permission, @PathVariable String userEmail) {
        User user = userService.findByEmail(userEmail);
        permission.setHolder(user);
        registerTokenToTopic(permission.getToken(), user.getEmail());
        log.info(permission);
        return permissionService.save(permission);
    }

    @PostMapping(value = "/api/notification/{userEmail}", consumes = "application/json", produces = "application/json")
    public void sendNotificationToUser(@RequestBody Map<String, String> notificationJson, @PathVariable String userEmail) {
        sendNotificationWithBodyToRecipient(notificationJson, "/topics/" + userEmail);
    }

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


    private void registerTokenToTopic(String token, String userEmail) {
        JSONObject requestJson = new JSONObject();
        requestJson.put("to", "/topics/" + userEmail);
        requestJson.put("registration_tokens", token);
        try {
            postRequestToUrlWithAuthorization(requestJson, TOPIC_REGISTRATION_URL);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            log.error(e);
        }
    }
}