package com.solbox.api.service;

import com.solbox.api.dao.SvcInfoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by ??? on 2018-05-02.
 */
@Service
public class SvcInfoServiceImpl implements SvcInfoService {
    @Autowired private SvcInfoDao svcInfoDao;

    @Override
    public String getCustomer(Map<String, Object> param) {
        return svcInfoDao.getCustomer(param);
    }
}
