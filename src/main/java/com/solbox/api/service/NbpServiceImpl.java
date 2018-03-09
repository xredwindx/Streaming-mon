package com.solbox.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2018-01-10.
 */
@Service
public class NbpServiceImpl implements NbpService {
    private static Logger log = LoggerFactory.getLogger(NbpServiceImpl.class);

    @Value("${nbp_url}")
    private String nbpUrl;

    @Override
    public List<Map<String, Object>> getNbpList(Map<String, Object> param) {
        RestTemplate rest = new RestTemplate();
        String now = param.get("now").toString();
        log.info(nbpUrl+"?from_date="+now);
        List<Map<String, Object>> returnValue = rest.getForObject(nbpUrl+"?from_date={now}", List.class, now);
        return returnValue;
    }
}
