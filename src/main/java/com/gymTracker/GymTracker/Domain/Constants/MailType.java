package com.gymTracker.GymTracker.Domain.Constants;

public enum MailType {
    SESSION_REGISTRATION("You have successfully registered"),
    SESSION_BOOKING("Your Session has be booked successfully"),
    SESSION_EDITED("Your session has been updated and edited successfully"),
    SESSION_REMINDER("This is just a remainder for your session"),
    SESSION_DELETION("Your session has been deleted successfully"),
    WORKOUT("Your workout has been created");

    private final String subject;

    MailType(String subject) {
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }
}
