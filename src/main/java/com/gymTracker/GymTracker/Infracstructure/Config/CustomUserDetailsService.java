package com.gymTracker.GymTracker.Infracstructure.Config;

import com.gymTracker.GymTracker.Infracstructure.Repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (!userRepository.existsByEmail(email)) {
            throw new UsernameNotFoundException("User not found");
        }
        Optional<com.gymTracker.GymTracker.Domain.Entity.User> gymUser = userRepository.findByEmail(email);
        return new User(email, gymUser.get().getPassword(),
                Collections.singleton(new SimpleGrantedAuthority( gymUser.get().getRole().name())));
    }
}
