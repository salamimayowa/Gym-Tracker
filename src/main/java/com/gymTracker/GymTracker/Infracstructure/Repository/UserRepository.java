package com.gymTracker.GymTracker.Infracstructure.Repository;

import com.gymTracker.GymTracker.Domain.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User , Long> {
    public User findByUserNameIgnoreCase(String userName);

    Optional<User> findByEmail(String email);

     boolean existsByEmail (String email);

}
