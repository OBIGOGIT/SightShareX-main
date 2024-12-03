package com.obigo.v2x.entity;

import lombok.Data;

@Data

public class ObjectSummaryWithLatestObjectDto {
    private Long id;
    private String objectType;
    private Integer totalCount;
    private Boolean active;
    private Boolean detecting;
    private Double lastLat;
    private Double lastLng;
    private ObjectEntity latestObjectEntity;

    public ObjectSummaryWithLatestObjectDto(ObjectSummaryWithLatestObjectProjection summary, ObjectEntity latestObjectEntity) {
        this.id = summary.getId();
        this.objectType = summary.getObjectType();
        this.totalCount = summary.getTotalCount();
        this.active = summary.getActive();
        this.detecting = summary.getDetecting();
        this.lastLat = summary.getLastLat();
        this.lastLng = summary.getLastLng();
        this.latestObjectEntity = latestObjectEntity;
    }

    public ObjectSummaryWithLatestObjectDto(ObjectSummaryEntity objectSummaryEntity) {

        this.id = objectSummaryEntity.getId();
        this.objectType = objectSummaryEntity.getObjectType();
        this.totalCount = objectSummaryEntity.getTotalCount();
        this.active = objectSummaryEntity.getActive();
        this.detecting = objectSummaryEntity.getDetecting();
        this.lastLat = objectSummaryEntity.getLastLat();
        this.lastLng = objectSummaryEntity.getLastLng();

    }
}
