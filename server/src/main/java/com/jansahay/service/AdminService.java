package com.jansahay.service;
import com.jansahay.dto.admin.DashboardStatsDto;
import com.jansahay.dto.admin.UserAdminDto;
import java.util.List;
public interface AdminService {
    DashboardStatsDto getDashboardStats();
    List<UserAdminDto> getAllUsers();
}
