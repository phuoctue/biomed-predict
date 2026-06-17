package com.mediai.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(BaseEntity.EntityTimestampListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public static class EntityTimestampListener {

        @PrePersist
        void prePersist(BaseEntity entity) {
            var now = Instant.now();
            entity.createdAt = now;
            entity.updatedAt = now;
        }

        @PreUpdate
        void preUpdate(BaseEntity entity) {
            entity.updatedAt = Instant.now();
        }
    }
}

