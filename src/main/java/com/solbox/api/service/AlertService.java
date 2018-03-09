package com.solbox.api.service;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-02-07.
 */
public interface AlertService {
    void sendSMS(Map<String, Object> param, Map<String, Object> alertInfo);
    void sendEmail(Map<String, Object> param, Map<String, Object> alertInfo);
    void sendTelegram(Map<String, Object> param, String type);
    Map<String, Object> getStreamingAlert(Map<String, Object> param);
    List<Map<String, Object>> getAlertList(Map<String, Object> param);
    int alertTotalCount(Map<String, Object> param);
    List<Map<String, Object>> getTelegramList(Map<String, Object> param);
    int telegramTotalCount(Map<String, Object> param);
    int addAlert(Map<String, Object> param);
    int delAlert(Map<String, Object> param);
    int editAlert(Map<String, Object> param);
    int addTelegram(Map<String, Object> param);
    int delTelegram(Map<String, Object> param);
    int editTelegram(Map<String, Object> param);
     Map<String, Object> getTelegram(Map<String, Object> param);
}
