package com.solbox.api.service;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2017-11-30.
 */
public interface UserService {
    Map<String, Object> getUserInfo(Map<String, Object> param);
    int changePwd(Map<String, Object> param);
    List<Map<String, Object>> getUserList(Map<String, Object> param);
    int totalCount(Map<String, Object> param);
    int getChkUserId(Map<String, Object> param);
    int insertUser(Map<String, Object> param);
    int pwdReset(Map<String, Object> param);
    int deleteUser(Map<String, Object> param);
    Map<String, Object> getUser(Map<String, Object> param);
    int updateUser(Map<String, Object> param);
}
