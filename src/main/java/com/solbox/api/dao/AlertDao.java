package com.solbox.api.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-02-07.
 */
@Mapper
public interface AlertDao {
    Map<String, Object> getTelegram(Map<String, Object> param);
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
}
