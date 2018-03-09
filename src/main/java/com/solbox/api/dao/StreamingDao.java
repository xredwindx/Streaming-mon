package com.solbox.api.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by ??? on 2017-12-06.
 */
@Mapper
public interface StreamingDao {
    int addStreaming(Map<String, Object> param);
    int updateStreaming(Map<String, Object> param);
    Map<String, Object> getCheckStreaming(Map<String, Object> param);
    int addStreamingHis(Map<String, Object> param);
    List<Map<String, Object>> getStreamingList(Map<String, Object> param);
    List<Map<String, Object>> getStreamingHistoryList(Map<String, Object> param);
    int historyTotalCount(Map<String, Object> param);
    int updateCheckedYN(Map<String, Object> param);
    int deleteStreaming(Map<String, Object> param);
}
