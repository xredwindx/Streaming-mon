package com.solbox.api.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * Created by ??? on 2018-05-02.
 */
@Mapper
public interface SvcInfoDao {
    String getCustomer(Map<String, Object> param);
}
