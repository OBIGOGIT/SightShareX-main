package com.obigo.v2x.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data

public class ObjectSummaryWithLatestImageDto {
    private Long id;
    private String objectType;
    private Integer totalCount;
    private Boolean active;
    private Boolean detecting;
    private Double lastLat;
    private Double lastLng;
    private String imagePath;
    private LocalDateTime created;


    public ObjectSummaryWithLatestImageDto(ObjectSummaryEntity objectSummaryEntity) {

        this.id = objectSummaryEntity.getId();
        this.objectType = objectSummaryEntity.getObjectType();
        this.totalCount = objectSummaryEntity.getTotalCount();
        this.active = objectSummaryEntity.getActive();
        this.detecting = objectSummaryEntity.getDetecting();
        this.lastLat = objectSummaryEntity.getLastLat();
        this.lastLng = objectSummaryEntity.getLastLng();
        this.created = objectSummaryEntity.getUpdated();
        if(objectSummaryEntity.getObjectEntities().size() == 0) {
            this.imagePath = null;
        }
        else {
            if(objectSummaryEntity.getObjectEntities().get(objectSummaryEntity.getObjectEntities().size()-1).getObjectImageEntity() == null) {
                this.imagePath = null;
            }
            else {
                this.imagePath = objectSummaryEntity.getObjectEntities().get(objectSummaryEntity.getObjectEntities().size()-1).getObjectImageEntity().getImagePath();
            }
        }

    }
}
