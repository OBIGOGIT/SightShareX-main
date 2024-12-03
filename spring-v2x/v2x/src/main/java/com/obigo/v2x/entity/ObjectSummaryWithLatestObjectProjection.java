package com.obigo.v2x.entity;

public interface ObjectSummaryWithLatestObjectProjection {
    Long getId();
    String getObjectType();
    Integer getTotalCount();
    Boolean getActive();
    Boolean getDetecting();
    Double getLastLat();
    Double getLastLng();

    // 최신 ObjectEntity 한 개를 포함
}
