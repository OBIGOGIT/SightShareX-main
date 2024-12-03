package com.obigo.v2x.util;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Slf4j
public class DateUtil {

    public static LocalDateTime stringToLocalDateTime(Object s) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        LocalDateTime dateTime = LocalDateTime.parse(String.valueOf(s), formatter);
        return dateTime;
    }

    public static LocalDate stringToLocalDate(Object s) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate dateTime = LocalDate.parse(String.valueOf(s), formatter);
        return dateTime;
    }

    public static LocalDateTime stringToLocalDateTimeStart(Object s) {
        if (s == null) {
            throw new IllegalArgumentException("Input date object cannot be null");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            // Convert the object to a string and parse it to LocalDate
            LocalDate localDate = LocalDate.parse(String.valueOf(s), formatter);
            localDate.minusMonths(1);
            // Convert LocalDate to LocalDateTime (at start of day)
            LocalDateTime localDateTime = localDate.atStartOfDay();
            return localDateTime;
        } catch (DateTimeParseException e) {
            // Handle parsing error
            throw new IllegalArgumentException("Unable to parse the date: " + s + ". Expected format is yyyy-MM-dd", e);
        }
    }

    public static LocalDateTime stringToLocalDateTimeEndOfDay(Object s) {
        if (s == null) {
            throw new IllegalArgumentException("Input date object cannot be null");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            // Convert the object to a string and parse it to LocalDate
            LocalDate localDate = LocalDate.parse(String.valueOf(s), formatter);
            localDate.minusMonths(1);
            // Convert LocalDate to LocalDateTime (at end of day, 23:59:59)
            LocalDateTime localDateTime = localDate.atTime(23, 59, 59);
            return localDateTime;
        } catch (DateTimeParseException e) {
            // Handle parsing error
            throw new IllegalArgumentException("Unable to parse the date: " + s + ". Expected format is yyyy-MM-dd", e);
        }
    }
}
