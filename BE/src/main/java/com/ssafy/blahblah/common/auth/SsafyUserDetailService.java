package com.ssafy.blahblah.common.auth;


import com.ssafy.blahblah.api.service.member.UserService;
import com.ssafy.blahblah.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 */
@Component
public class SsafyUserDetailService implements UserDetailsService{
	@Autowired
	UserService userService;
	
    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
    		User user = userService.getUserByEmail(userEmail);
    		if(user != null) {
    			SsafyUserDetails userDetails = new SsafyUserDetails(user);
    			return userDetails;
    		}
    		return null;
    }
}
