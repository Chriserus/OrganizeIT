package com.capgemini.organizeIT.notification.controlers;

import com.capgemini.organizeIT.permission.services.PermissionService;
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
    private final PermissionService permissionService;

    public NotificationController(final PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    // TODO: Post request - adds received body to "to" json
    @PostMapping(value = "/api/notification/{userEmail}", consumes = "application/json", produces = "application/json")
    public void sendNotificationToUser(@RequestBody Map<String, String> notificationJson, @PathVariable String userEmail) {
        permissionService.findByEmail(userEmail).forEach(permission -> {
            log.info(permission.getToken());
            try {
                sendNotificationWithBodyToToken(notificationJson, permission.getToken());
            } catch (URISyntaxException | IOException | InterruptedException e) {
                log.error(e);
            }
        });
    }

    private void sendNotificationWithBodyToToken(Map<String, String> body, String token) throws URISyntaxException, IOException, InterruptedException {
        JSONObject requestJson = new JSONObject();
        requestJson.put("notification", body);
        requestJson.put("to", token);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://fcm.googleapis.com/fcm/send"))
                // TODO: Store key in some secret place
                .header("Authorization", "key=")
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestJson.toString()))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        log.info(response.body());
    }
}
