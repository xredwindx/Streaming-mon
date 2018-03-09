package com.solbox.api.service;

import com.solbox.api.dao.AlertDao;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-02-07.
 */
@Service
public class AlertServiceImpl implements AlertService {
    private static Logger log = LoggerFactory.getLogger(AlertServiceImpl.class);
    @Autowired private AlertDao alertDao;
    @Value("${telegram.GOOGLEAPIKEY}")
    private String googleApiKey;
    @Value("${telegram.DN_TS_PATH}")
    private String dnTsPath;

    @Override
    public Map<String, Object> getStreamingAlert(Map<String, Object> param) {
        return alertDao.getStreamingAlert(param);
    }

    @Override
    public void sendSMS(Map<String, Object> param, Map<String, Object> alertInfo) {
        RestTemplate rest = new RestTemplate();

        String message = "["+param.get("service").toString()+"] ";
        message += param.get("server_type").toString()+" "+param.get("vol").toString()+" ";
        message += param.get("stream_name").toString()+" "+param.get("status").toString();

        String url = alertInfo.get("sms_url").toString();
        url += "?id=" + alertInfo.get("sms_url_id").toString();
        url += "&pw=" + alertInfo.get("sms_url_pwd").toString();
        url += "&pn=" + alertInfo.get("sms_phone").toString();
        url += "&cb=" + alertInfo.get("sms_callback").toString();
        url += "&msg=" + message;
        log.info(url);

        try {
            String returnValue = rest.getForObject(url, String.class);
            log.info(message+" " + returnValue);
            log.info("sms done " + message);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            log.error("sms fail " + message);
        }

    }

    @Override
    public void sendEmail(Map<String, Object> param, Map<String, Object> alertInfo) {
        RestTemplate rest = new RestTemplate();

        String title = "[FS]["+param.get("service").toString()+"] "+param.get("type").toString()+" ";
        title += param.get("vol").toString()+" "+param.get("stream_name").toString()+" ";
        title += param.get("server_type").toString()+" "+param.get("status").toString();

        String message = "EVENT TIME : "+ LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        message += "\nORIGIN HOST IPS : "+ param.get("host_name").toString();
        message += "\nSERVICE NAME : "+ param.get("service").toString();
        message += "\nCHANNEL NAME : "+ param.get("vol").toString();
        message += "\nSTREAM NAME : "+ param.get("stream_name").toString();
        message += "\nSTATUS : "+ param.get("server_type").toString()+" "+param.get("status").toString();

        String url = alertInfo.get("mail_url").toString();
        url += "?id=" + alertInfo.get("mail_url_id").toString();
        url += "&pw=" + alertInfo.get("mail_url_pwd").toString();
        url += "&to=" + alertInfo.get("mail_to").toString();
        url += "&from=" + alertInfo.get("mail_from").toString();
        url += "&subject=" + title;
        url += "&message="+message;
        log.info(url);

        try {
            String returnValue = rest.getForObject(url, String.class);
            log.info(title+" "+returnValue);
            log.info("email done " + title);
        } catch(Exception e) {
            log.error(e.getMessage(), e);
            log.error("email fail " + title);
        }
    }

    @Override
    public void sendTelegram(Map<String, Object> param, String type) {
        RestTemplate rest = new RestTemplate();
        // 서비스별 telegram 정보 가져오기
        Map<String, Object> telegramInfo = alertDao.getTelegram(param);
        if(telegramInfo != null) {
            String url = "https://api.telegram.org/bot" + telegramInfo.get("telegram_api_key").toString();

            if (type.equals("message")) {
                String shortUrl = this.getShortUrl(param, telegramInfo);
                String message = "[" + param.get("service").toString() + "] " + param.get("type").toString() + " ";
                message += param.get("vol").toString() + " " + param.get("stream_name").toString() + " ";
                message += param.get("server_type").toString() + " " + param.get("status").toString();
                message += "\nEVENT TIME : " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                message += "\nHOST IPS : " + param.get("host_name").toString();
                message += "\nSERVICE NAME : " + param.get("service").toString();
                message += "\nCHANNEL NAME : " + param.get("vol").toString();
                message += "\nSTREAM NAME : " + param.get("stream_name").toString();
                message += "\nSTREAM URL : " + shortUrl;
                message += "\nSTATUS : " + param.get("server_type").toString() + " " + param.get("status").toString();

                url += "/sendMessage?chat_id=" + telegramInfo.get("telegram_chat_id").toString() + "&text=" + message;
                log.info(url);

                try {
                    String returnValue = rest.getForObject(url, String.class);
                    log.info("telegram message done " + returnValue);
                } catch(Exception e) {
                    log.error(e.getMessage(), e);
                    log.error("telegram message fail " + url);
                }

            } else if (type.equals("file")) {
                    // dn_ts_path 정의 필요 테스트 필요
                String selectFile = dnTsPath + "/" + param.get("service").toString() + "/" + param.get("vol").toString() + "_"
                        + param.get("server_type").toString() + "_" + param.get("stream_name").toString() + ".mp4";

                try {
                    File file = new File(selectFile);

                    MultiValueMap<String, Object> restParam = new LinkedMultiValueMap<>();
                    restParam.add("chat_id", telegramInfo.get("telegram_chat_id"));
                    ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file.toPath())) {
                        @Override
                        public String getFilename() throws IllegalStateException {
                            return selectFile;
                        }
                    };
                    restParam.add("video", resource);

                    url += "/sendVideo";
                    String returnValue = rest.postForObject(url, restParam, String.class);
                    log.info(selectFile + " " + returnValue);
                    log.info("telegram file done " + selectFile);
                } catch(Exception e) {
                    log.error(e.getMessage(), e);
                    log.error("telegram file fail " + selectFile);
                }
            }
        }
    }

    public String getShortUrl(Map<String, Object> param, Map<String, Object> telegramInfo) {
        RestTemplate rest = new RestTemplate();
        String token = this.getJWTToken(param, telegramInfo);
        String longUrl = telegramInfo.get("stream_domain").toString()+"/"+param.get("vol").toString()+"/"
                +param.get("stream_name").toString()+"/playlist.m3u8?token="+token;

        Map<String, String> restParam = new HashMap<>();
        restParam.put("longUrl", longUrl);
        String url = "https://www.googleapis.com/urlshortener/v1/url?key="+googleApiKey;
        Map<String, String> returnRes = rest.postForObject(url, restParam, Map.class);

        String shortUrl = returnRes.get("id");
        return shortUrl;
    }

    public String getJWTToken(Map<String, Object> param, Map<String, Object> telegramInfo) {
        String token = "";

        LocalDateTime nowDate = LocalDateTime.now();
        LocalDateTime expireDate = nowDate.plusDays(1);

        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> claim = new HashMap<>();
        claim.put("exp", Date.from(expireDate.atZone(ZoneId.systemDefault()).toInstant()).getTime()/1000+"");
        claim.put("path", "/"+param.get("vol").toString()+"/"+param.get("stream_name").toString());

        token = Jwts.builder()
                .setHeaderParams(header)
                .setClaims(claim)
                .signWith(SignatureAlgorithm.HS256, telegramInfo.get("jwt_secret_key").toString().getBytes())
                .compact();

        return token;
    }

    @Override
    public List<Map<String, Object>> getAlertList(Map<String, Object> param) {
        return alertDao.getAlertList(param);
    }

    @Override
    public int alertTotalCount(Map<String, Object> param) {
        return alertDao.alertTotalCount(param);
    }

    @Override
    public List<Map<String, Object>> getTelegramList(Map<String, Object> param) {
        return alertDao.getTelegramList(param);
    }

    @Override
    public int telegramTotalCount(Map<String, Object> param) {
        return alertDao.telegramTotalCount(param);
    }

    @Override
    public int addAlert(Map<String, Object> param) {
        return alertDao.addAlert(param);
    }

    @Override
    public int delAlert(Map<String, Object> param) {
        return alertDao.delAlert(param);
    }

    @Override
    public int editAlert(Map<String, Object> param) {
        return alertDao.editAlert(param);
    }

    @Override
    public int addTelegram(Map<String, Object> param) {
        return alertDao.addTelegram(param);
    }

    @Override
    public int delTelegram(Map<String, Object> param) {
        return alertDao.delTelegram(param);
    }

    @Override
    public int editTelegram(Map<String, Object> param) {
        return alertDao.editTelegram(param);
    }

    @Override
    public Map<String, Object> getTelegram(Map<String, Object> param) {
        return alertDao.getTelegram(param);
    }
}
