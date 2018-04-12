package com.solbox.api.controller;

import com.solbox.api.service.AlertService;
import com.solbox.api.service.StreamingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2017-12-06.
 */
@RestController
public class StreamingController {
    private static Logger log = LoggerFactory.getLogger(StreamingController.class);
    @Autowired private StreamingService streamingService;
    @Autowired private AlertService alertService;

    @RequestMapping(value = "/api/streaming/add", method = RequestMethod.POST)
    public ResponseEntity<?> addStreaming(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        String returnStr = "";
        Long monCnt = 0L;

        try {
            if (param.get("status") != null) {
                Map<String, Object> chkInfo = streamingService.getCheckStreaming(param);

                if (chkInfo == null) { // 생성
                    // RECOVERY인 경우 생성 무시
                    String s = (String) param.get("status");
                    if (!s.equalsIgnoreCase("RECOVERY")) {
                        monCnt += 1;
                        param.put("mon_count", monCnt);
                        param.put("mon_level", "Warning");
                        streamingService.addStreaming(param);
                    }
                } else { // 수정
                    monCnt = (Long) chkInfo.get("mon_count");
                    monCnt += 1;
                    if (monCnt == 2) {
                        param.put("mon_level", "Error");
                    } else {
                        param.put("mon_level", "Critical");
                    }
                    param.put("mon_count", monCnt);
                    streamingService.updateStreaming(param);

                    // sms, email alert
                    Map<String, Object> alertInfo = alertService.getStreamingAlert(param);
                    // 점검이 아닐경우
                    if(alertInfo != null && chkInfo.get("checked_yn").toString().equals("N")) {
                        // alert 주기
                        if (monCnt <= (int)alertInfo.get("alert_start")
                                    || (monCnt % (int)alertInfo.get("alert_interval")) == 0) {
                            // sms alert 값 없으면 안 보내는 케이스 있음
                            if(!alertInfo.get("sms_url").toString().equals("")) {
                                alertService.sendSMS(param, alertInfo);
                            }
                            // email notice
                            alertService.sendEmail(param, alertInfo);
                        }

                        // telegram alert
                        alertService.sendTelegram(param, "message");
                        if(!param.get("status").toString().equalsIgnoreCase("DEAD")) {
                            alertService.sendTelegram(param, "file");
                        }
                    }
                }

                // history
                streamingService.addStreamingHis(param);
            }
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(returnStr, apiStatus);
    }

    @RequestMapping(value = "/api/streaming", method = RequestMethod.POST)
    public ResponseEntity<?> getStreamingList(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> streamingList = null;

        try {
            streamingList = streamingService.getStreamingList(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(streamingList, apiStatus);
    }

    @RequestMapping(value = "/api/streaming/history", method = RequestMethod.POST)
    public ResponseEntity<?> getStreamingHistory(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        List<Map<String, Object>> streamingHistoryList = null;
        int totalCount = 0;

        try {
            streamingHistoryList = streamingService.getStreamingHistoryList(param);
            totalCount = streamingService.historyTotalCount(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Map<String, Object> returnValue = new HashMap<>();
        returnValue.put("streamingHistoryList", streamingHistoryList);
        returnValue.put("totalCount", totalCount);

        return new ResponseEntity<>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/streaming/check", method = RequestMethod.POST)
    public ResponseEntity<?> editCheckedYN(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = streamingService.updateCheckedYN(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(returnValue, apiStatus);
    }

    @RequestMapping(value = "/api/streaming/delete", method = RequestMethod.POST)
    public ResponseEntity<?> deleteStreaming(@RequestBody Map<String, Object> param) {
        HttpStatus apiStatus = HttpStatus.OK;
        int returnValue = 0;

        try {
            returnValue = streamingService.deleteStreaming(param);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            apiStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(returnValue, apiStatus);
    }
}
