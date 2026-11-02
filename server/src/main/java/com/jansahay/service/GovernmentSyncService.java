package com.jansahay.service;

import com.jansahay.dto.realtime.GovSyncReportDto;
import com.jansahay.dto.scheme.SchemeDto;
import com.jansahay.dto.update.GovernmentUpdateDto;
import java.util.List;

public interface GovernmentSyncService {
    GovSyncReportDto syncAllGovernmentSources();
    GovSyncReportDto fetchAndIngestSchemes();
    List<GovernmentUpdateDto> fetchLivePIBUpdates();
    List<SchemeDto> getLiveSchemes(String keyword);
    List<GovernmentUpdateDto> getLiveTicker();
}
