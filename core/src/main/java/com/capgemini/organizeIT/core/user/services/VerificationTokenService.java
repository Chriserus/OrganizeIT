package com.capgemini.organizeIT.core.user.services;

import com.capgemini.organizeIT.infrastructure.user.entities.VerificationToken;
import com.capgemini.organizeIT.infrastructure.user.repositories.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;


    public VerificationToken save(VerificationToken verificationToken) {
        return verificationTokenRepository.save(verificationToken);
    }

    public VerificationToken findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }
}
