package com.jansahay.service.impl;

import com.jansahay.dto.document.*;
import com.jansahay.entity.*;
import com.jansahay.enums.DocumentStatus;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.repository.*;
import com.jansahay.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final RequiredDocumentRepository requiredDocumentRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final SchemeRepository schemeRepository;

    @Override
    public DocumentChecklistResponse getDocumentChecklist(Long userId, Long schemeId) {
        return calculateDocumentReadiness(userId, schemeId);
    }

    @Override
    public List<UserDocument> getUserDocuments(Long userId) {
        return userDocumentRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public UserDocument updateDocumentStatus(Long userId, UpdateDocumentStatusRequest request) {
        UserDocument doc = userDocumentRepository
                .findByUserIdAndDocumentName(userId, request.getDocumentName())
                .orElse(UserDocument.builder().userId(userId)
                        .documentName(request.getDocumentName())
                        .documentType(request.getDocumentName()).build());
        doc.setStatus(request.getStatus());
        return userDocumentRepository.save(doc);
    }

    @Override
    public DocumentChecklistResponse calculateDocumentReadiness(Long userId, Long schemeId) {
        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme", schemeId));
        List<RequiredDocument> required = requiredDocumentRepository.findBySchemeId(schemeId);
        List<UserDocument> userDocs = (userId != null) ? userDocumentRepository.findByUserId(userId) : Collections.emptyList();
        Map<String, UserDocument> userDocMap = userDocs.stream()
                .collect(Collectors.toMap(d -> d.getDocumentName().toLowerCase(), d -> d, (a, b) -> a));

        List<DocumentChecklistResponse.DocumentItemDto> items = required.stream().map(rd -> {
            UserDocument ud = findMatchingUserDoc(userDocMap, rd.getDocumentName());
            DocumentStatus status = ud != null ? ud.getStatus() : DocumentStatus.NOT_VERIFIED;
            String docName = rd.getDocumentName();
            String docType = resolveDocType(docName);

            return DocumentChecklistResponse.DocumentItemDto.builder()
                    .requiredDocumentId(rd.getId())
                    .userDocumentId(ud != null ? ud.getId() : null)
                    .documentName(docName)
                    .documentType(docType)
                    .purpose(rd.getPurpose() != null ? rd.getPurpose() : "Mandatory eligibility verification")
                    .requiredFlag(rd.getRequiredFlag() != null ? rd.getRequiredFlag() : true)
                    .status(status)
                    .issuingAuthority(resolveAuthority(docName))
                    .hasGuide(true)
                    .howToGetGuide(resolveGuideSummary(docName))
                    .officialPortalUrl(resolvePortalUrl(docName))
                    .feeAndTimeline(resolveFeeAndTimeline(docName))
                    .prerequisites(resolvePrerequisites(docName))
                    .stepByStepProcess(resolveStepByStepProcess(docName))
                    .build();
        }).collect(Collectors.toList());

        long available = items.stream().filter(i -> i.getStatus() == DocumentStatus.AVAILABLE).count();
        long missing = items.stream().filter(i -> i.getStatus() != DocumentStatus.AVAILABLE).count();
        int percentage = (int) Math.round((double) available * 100 / Math.max(required.size(), 1));

        String readinessMsg = available + " of " + required.size() + " documents ready (" + percentage + "% Complete).";
        if (missing > 0) readinessMsg += " " + missing + " document(s) still need to be obtained.";

        return DocumentChecklistResponse.builder()
                .schemeId(schemeId)
                .schemeName(scheme.getName())
                .totalDocuments(required.size())
                .availableDocuments((int) available)
                .missingDocuments((int) missing)
                .readinessPercentage(percentage)
                .readinessMessage(readinessMsg)
                .documents(items)
                .build();
    }

    private String resolveDocType(String name) {
        String n = name.toLowerCase();
        if (n.contains("income")) return "INCOME_CERTIFICATE";
        if (n.contains("domicile") || n.contains("residence")) return "DOMICILE_CERTIFICATE";
        if (n.contains("validity")) return "CASTE_VALIDITY";
        if (n.contains("caste")) return "CASTE_CERTIFICATE";
        if (n.contains("creamy") || n.contains("ncl")) return "NON_CREAMY_LAYER";
        if (n.contains("7/12") || n.contains("satbara") || n.contains("8a")) return "SEVEN_TWELVE_EXTRACT";
        if (n.contains("bonafide")) return "BONAFIDE_CERTIFICATE";
        if (n.contains("ration")) return "RATION_CARD";
        if (n.contains("allotment") || n.contains("cap")) return "CAP_ALLOTMENT";
        if (n.contains("udyam") || n.contains("msme")) return "UDYAM_REGISTRATION";
        if (n.contains("bank") || n.contains("passbook")) return "BANK_AADHAAR_SEEDING";
        if (n.contains("disability") || n.contains("udid")) return "DISABILITY_CERTIFICATE";
        return "GENERAL_DOCUMENT";
    }

    private String resolveAuthority(String name) {
        String n = name.toLowerCase();
        if (n.contains("income") || n.contains("creamy") || n.contains("ncl")) return "Tahsildar / Sub-Divisional Officer (Revenue Department)";
        if (n.contains("domicile")) return "Executive Magistrate / Tahsildar (Aaple Sarkar)";
        if (n.contains("validity")) return "Divisional Caste Scrutiny Committee (BARTI / Social Justice)";
        if (n.contains("caste")) return "Sub-Divisional Officer (SDO) / Deputy Collector";
        if (n.contains("7/12") || n.contains("satbara") || n.contains("8a")) return "Revenue & Forest Dept (Mahabhumi Bhulekh)";
        if (n.contains("bonafide") || n.contains("fee receipt")) return "Principal / Registrar of Enrolled College";
        if (n.contains("allotment")) return "State CET Cell / Directorate of Technical Education (DTE)";
        if (n.contains("udyam") || n.contains("msme")) return "Ministry of MSME, Government of India";
        if (n.contains("bank") || n.contains("passbook")) return "Authorized Bank Branch & NPCI";
        if (n.contains("ration")) return "Food, Civil Supplies & Consumer Protection Department";
        if (n.contains("disability") || n.contains("udid")) return "District Medical Board / CMO";
        return "Concerned Government Office / Competent Authority";
    }

    private String resolvePortalUrl(String name) {
        String n = name.toLowerCase();
        if (n.contains("income") || n.contains("domicile") || n.contains("caste") || n.contains("ncl")) return "https://aaplesarkar.mahaonline.gov.in";
        if (n.contains("7/12") || n.contains("satbara") || n.contains("8a")) return "https://digitalsatbara.mahabhumi.gov.in";
        if (n.contains("validity")) return "https://barti.maharashtra.gov.in";
        if (n.contains("udyam") || n.contains("msme")) return "https://udyamregistration.gov.in";
        if (n.contains("allotment")) return "https://cetcell.mahacet.org";
        if (n.contains("aadhaar") || n.contains("bank")) return "https://myaadhaar.uidai.gov.in";
        return "https://www.myscheme.gov.in";
    }

    private String resolveFeeAndTimeline(String name) {
        String n = name.toLowerCase();
        if (n.contains("7/12") || n.contains("satbara")) return "₹15 per digital signed copy • Instant Download";
        if (n.contains("income") || n.contains("domicile") || n.contains("ncl")) return "₹33 statutory RTS fee • 15 to 21 working days";
        if (n.contains("caste")) return "₹33 to ₹50 • 21 to 45 working days";
        if (n.contains("validity")) return "Government fee ₹0 - ₹50 • 45 to 90 working days";
        if (n.contains("udyam")) return "₹0 (100% Free on official portal) • 1 to 2 working days";
        if (n.contains("bonafide")) return "College nominal fee (₹0 - ₹50) • 1 to 2 days";
        return "As per State Right to Public Services Act (RTS)";
    }

    private List<String> resolvePrerequisites(String name) {
        String n = name.toLowerCase();
        if (n.contains("income")) return List.of("Aadhaar Card", "Ration Card copy", "Salary slips / Form 16 OR Talathi Income Verification Report", "Self-declaration affidavit");
        if (n.contains("domicile")) return List.of("Birth Certificate or School Leaving Certificate showing birthplace in state", "15 years continuous residential proof (electricity bill, ration card)", "Aadhaar Card / Voter ID");
        if (n.contains("caste") || n.contains("validity")) return List.of("Ancestor school record pre-1967/1950 showing caste entry", "Father/Grandfather TC", "Affidavit Form 3", "Genealogy tree (Vanshavali)");
        if (n.contains("7/12") || n.contains("satbara")) return List.of("District, Taluka, Village name", "Gat Number or Survey Number");
        if (n.contains("udyam")) return List.of("Aadhaar card of owner/director", "PAN Card", "Bank account number & IFSC", "Plant/Enterprise address");
        return List.of("Aadhaar Card copy", "Recent passport size photographs", "Application form duly signed");
    }

    private List<String> resolveStepByStepProcess(String name) {
        String n = name.toLowerCase();
        if (n.contains("income")) {
            return List.of(
                    "Step 1: Open the state portal at aaplesarkar.mahaonline.gov.in and login via citizen credentials.",
                    "Step 2: Navigate to Revenue Services -> Certificates -> 'Income Certificate'.",
                    "Step 3: Fill in family income from all agricultural, business, and salary sources.",
                    "Step 4: Upload applicant photo, Aadhaar card, and Talathi income enquiry report.",
                    "Step 5: Pay the statutory fee of ₹33 online via UPI or Netbanking.",
                    "Step 6: Track status online; download digitally signed, barcode-verified certificate upon Tehsildar approval."
            );
        } else if (n.contains("domicile")) {
            return List.of(
                    "Step 1: Visit aaplesarkar.mahaonline.gov.in and click on Revenue Department Services.",
                    "Step 2: Select 'Age, Nationality and Domicile Certificate' service.",
                    "Step 3: Provide residential address history demonstrating 15+ years stay in Maharashtra.",
                    "Step 4: Upload School Leaving Certificate (LC), electricity bill, and ration card.",
                    "Step 5: Complete online RTS fee payment of ₹33.",
                    "Step 6: Collect digitally signed Domicile Certificate from your portal dashboard."
            );
        } else if (n.contains("7/12") || n.contains("satbara")) {
            return List.of(
                    "Step 1: Visit digitalsatbara.mahabhumi.gov.in (Official Digital Land Records Portal).",
                    "Step 2: Sign up with mobile number and recharge wallet by ₹15.",
                    "Step 3: Select District -> Taluka -> Village and enter your Gat/Survey Number.",
                    "Step 4: Verify the owner names displayed on screen.",
                    "Step 5: Click 'Download Digitally Signed 7/12' (Village Form VII-XII) with ULPIN QR code."
            );
        } else if (n.contains("validity")) {
            return List.of(
                    "Step 1: Access the CCVIS Caste Validity portal (barti.maharashtra.gov.in).",
                    "Step 2: Fill out Form 16 (for higher education) or Form 17 (for employment).",
                    "Step 3: Upload father/grandfather historical school registers showing caste entry prior to deem date.",
                    "Step 4: Upload notary attested genealogy tree (Vanshavali) connecting applicant to ancestor.",
                    "Step 5: Forward physical dossier attested by college principal to the District Scrutiny Committee.",
                    "Step 6: Track committee verification; collect final Certificate of Validity upon clearance."
            );
        } else if (n.contains("udyam")) {
            return List.of(
                    "Step 1: Visit official government portal: udyamregistration.gov.in (Completely Free).",
                    "Step 2: Enter Aadhaar Number and Name; authenticate via OTP.",
                    "Step 3: Validate PAN number; enter enterprise trade name and office address.",
                    "Step 4: Select 4-digit NIC classification code representing your business activity.",
                    "Step 5: Enter number of employees and bank account details for MSME benefits.",
                    "Step 6: Submit final OTP. Download your official Udyam Registration Certificate immediately."
            );
        } else if (n.contains("bonafide")) {
            return List.of(
                    "Step 1: Submit a bonafide request slip at your college academic office or student ERP.",
                    "Step 2: State purpose as 'MahaDBT / Government Scholarship Application'.",
                    "Step 3: Administrative officer generates bonafide mentioning course, academic year, and enrollment number.",
                    "Step 4: Obtain college Principal's official seal and signature."
            );
        } else {
            return List.of(
                    "Step 1: Visit the designated issuing authority portal or nearest Citizen Service Center (CSC / Setu).",
                    "Step 2: Fill out the application form with accurate identity and family details.",
                    "Step 3: Attach self-attested copies of Aadhaar card and required supporting proofs.",
                    "Step 4: Submit application, pay statutory fee, and collect acknowledgment receipt with tracking number.",
                    "Step 5: Download verified document upon administrative sanction."
            );
        }
    }

    private String resolveGuideSummary(String name) {
        String n = name.toLowerCase();
        if (n.contains("income")) return "Issued by Tehsildar via Aaple Sarkar. Requires 15 days, ₹33 fee, and Talathi enquiry report.";
        if (n.contains("domicile")) return "Issued by Executive Magistrate on Aaple Sarkar. Requires 15 years state residency proof and School Leaving Certificate.";
        if (n.contains("7/12") || n.contains("satbara")) return "Digitally signed instantly on digitalsatbara.mahabhumi.gov.in for ₹15.";
        if (n.contains("validity")) return "Issued by Caste Scrutiny Committee (BARTI) with ancestor pre-deem records and family tree.";
        if (n.contains("udyam")) return "Issued instantly and 100% free on udyamregistration.gov.in via Aadhaar OTP.";
        if (n.contains("bonafide")) return "Issued by college principal office within 1-2 days for scholarship submissions.";
        return "Available through designated state portal or nearest CSC Setu Kendra.";
    }

    private UserDocument findMatchingUserDoc(Map<String, UserDocument> userDocMap, String reqDocName) {
        if (reqDocName == null) return null;
        String cleanReq = reqDocName.toLowerCase().trim();
        if (userDocMap.containsKey(cleanReq)) return userDocMap.get(cleanReq);
        for (Map.Entry<String, UserDocument> entry : userDocMap.entrySet()) {
            String key = entry.getKey();
            if (cleanReq.contains(key) || key.contains(cleanReq)) return entry.getValue();
            String[] keywords = {"aadhaar", "income", "domicile", "caste", "7/12", "satbara", "ration", "bank", "pan", "bonafide", "marksheet", "allotment", "udyam", "leaving", "photo"};
            for (String kw : keywords) {
                if (cleanReq.contains(kw) && key.contains(kw)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }
}
