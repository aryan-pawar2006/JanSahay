package com.jansahay.service.impl;

import com.jansahay.dto.document.DocumentGuideDto;
import com.jansahay.exception.ResourceNotFoundException;
import com.jansahay.service.DocumentGuideService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DocumentGuideServiceImpl implements DocumentGuideService {

    private final List<DocumentGuideDto> guides = new ArrayList<>();

    public DocumentGuideServiceImpl() {
        initGuides();
    }

    @Override
    public List<DocumentGuideDto> getAllGuides(String state) {
        if (state == null || state.isBlank() || "all".equalsIgnoreCase(state)) {
            return guides;
        }
        return guides.stream()
                .filter(g -> g.getApplicableState().equalsIgnoreCase(state) || "All India".equalsIgnoreCase(g.getApplicableState()))
                .collect(Collectors.toList());
    }

    @Override
    public DocumentGuideDto getGuideById(Long id) {
        return guides.stream()
                .filter(g -> g.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Document guide not found for id: " + id));
    }

    @Override
    public DocumentGuideDto getGuideByType(String type, String state) {
        String cleanType = type != null ? type.toUpperCase().replace(" ", "_") : "";
        return guides.stream()
                .filter(g -> g.getDocumentType().equalsIgnoreCase(cleanType) ||
                        cleanType.contains(g.getDocumentType()) ||
                        g.getDocumentType().contains(cleanType) ||
                        g.getTitle().toLowerCase().contains(type.toLowerCase()))
                .findFirst()
                .orElse(createFallbackGuide(type));
    }

    private DocumentGuideDto createFallbackGuide(String type) {
        return DocumentGuideDto.builder()
                .id(999L)
                .documentType(type)
                .title(type.replace("_", " "))
                .simpleDescription("Official certificate required for eligibility verification.")
                .issuingAuthority("Designated State Competent Authority / Setu Suvidha Kendra")
                .applicableState("Maharashtra")
                .possibleFees("₹33 to ₹50 as per State Public Services Act")
                .estimatedTime("15 to 21 working days")
                .officialUrl("https://aaplesarkar.mahaonline.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Aadhaar Card copy", "Proof of Identity & Address", "Application Form"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Register on Citizen Portal", "Visit state citizen service portal (Aaple Sarkar or CSC center).", true, "Citizen Portal"),
                        new DocumentGuideDto.StepItem(2, "Upload Supporting Documents", "Scan and upload self-attested supporting proofs.", true, "Citizen Portal"),
                        new DocumentGuideDto.StepItem(3, "Submit and Receive Tracking ID", "Pay nominal RTS fee and download digitally signed certificate.", true, "Citizen Portal")
                ))
                .build();
    }

    private void initGuides() {
        // 1. Income Certificate
        guides.add(DocumentGuideDto.builder()
                .id(1L)
                .documentType("INCOME_CERTIFICATE")
                .title("Income Certificate (उत्पन्नाचा दाखला)")
                .simpleDescription("Official legal certificate declaring the annual family income of a citizen, issued by the Revenue Department for government scholarship, fee reimbursement, and subsidy schemes.")
                .issuingAuthority("Tehsildar / Sub-Divisional Officer (Revenue Department, Govt of Maharashtra)")
                .applicableState("Maharashtra")
                .possibleFees("₹33.00 (statutory fee under Right to Services Act)")
                .estimatedTime("15 to 21 working days")
                .officialUrl("https://aaplesarkar.mahaonline.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Applicant Aadhaar Card", "Ration Card copy (listing all family members)", "Salary slips / Form 16 / ITR OR Talathi Income Enquiry Panchnama", "Self-declaration affidavit (Form 1)"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Create Aaple Sarkar Profile", "Visit aaplesarkar.mahaonline.gov.in and register with Aadhaar OTP.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(2, "Select Revenue Department Service", "Choose Revenue Services -> Certificates -> Income Certificate (1 Year / 3 Years).", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(3, "Upload Scanned Documents", "Upload photo, identity proof, address proof, and Talathi income proof report.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(4, "Pay Statutory Fee", "Complete online payment of ₹33 via UPI or Net Banking.", true, "MahaOnline Payment"),
                        new DocumentGuideDto.StepItem(5, "Download Digitally Signed Certificate", "Download QR code and barcode verified certificate with digital signature.", true, "Aaple Sarkar")
                ))
                .build());

        // 2. Domicile Certificate
        guides.add(DocumentGuideDto.builder()
                .id(2L)
                .documentType("DOMICILE_CERTIFICATE")
                .title("Domicile & Nationality Certificate (अधिवास व राष्ट्रीयत्व प्रमाणपत्र)")
                .simpleDescription("Official proof that a citizen has continuously resided in Maharashtra for at least 15 years, mandatory for state quota admissions, MahaDBT scholarships, and government jobs.")
                .issuingAuthority("Executive Magistrate / Tehsildar / Sub-Divisional Officer")
                .applicableState("Maharashtra")
                .possibleFees("₹33.00")
                .estimatedTime("15 working days")
                .officialUrl("https://aaplesarkar.mahaonline.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("School Leaving Certificate (LC/TC) showing birthplace in state", "15 years continuous residential proof (ration card, light bill, property tax receipt)", "Voter ID / Aadhaar Card", "Parent Domicile (if applicant is minor)"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Aaple Sarkar Application", "Navigate to Revenue Services -> Age, Nationality & Domicile Certificate.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(2, "Fill Residence History", "Enter continuous 15-year residential address history in Maharashtra.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(3, "Upload School Leaving Proof", "Upload LC/TC and municipal birth certificate.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(4, "Officer Scrutiny & Issuance", "Pay ₹33 fee. Tehsildar sanctions digital certificate within 15 days.", true, "Aaple Sarkar")
                ))
                .build());

        // 3. Caste Certificate
        guides.add(DocumentGuideDto.builder()
                .id(3L)
                .documentType("CASTE_CERTIFICATE")
                .title("Caste Certificate (जातीचे प्रमाणपत्र)")
                .simpleDescription("Official certificate issued to persons belonging to Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (OBC), VJNT, or SEBC.")
                .issuingAuthority("Sub-Divisional Officer (SDO) / Deputy Collector")
                .applicableState("Maharashtra")
                .possibleFees("₹33.00")
                .estimatedTime("21 to 45 working days")
                .officialUrl("https://aaplesarkar.mahaonline.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Family school leaving register pre-dating deem date (SC: 1950, VJNT/NT: 1961, OBC: 1967)", "Father/Grandfather TC showing caste entry", "Affidavit Form 3", "Genealogy tree (Vanshavali)"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Online Application", "Apply on Aaple Sarkar under Revenue Department -> Caste Certificate.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(2, "Provide Historical Caste Evidence", "Upload pre-1967 (OBC) or pre-1950 (SC) school/land records of father/ancestor.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(3, "Sub-Divisional Officer Order", "SDO office validates revenue records and issues signed Caste Certificate.", true, "SDO Office")
                ))
                .build());

        // 4. Caste Validity
        guides.add(DocumentGuideDto.builder()
                .id(4L)
                .documentType("CASTE_VALIDITY")
                .title("Caste Validity Certificate (जात पडताळणी प्रमाणपत्र)")
                .simpleDescription("Statutory verification by District Scrutiny Committee confirming authenticity of Caste Certificate for higher education admissions and scholarships.")
                .issuingAuthority("Divisional Caste Scrutiny Committee (Dr. Babasaheb Ambedkar Research & Training Institute - BARTI)")
                .applicableState("Maharashtra")
                .possibleFees("₹0 to ₹50")
                .estimatedTime("45 to 90 working days")
                .officialUrl("https://barti.maharashtra.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Original Caste Certificate", "Father & Grandfather primary school leaving certificate", "College Principal forwarding letter (Form 16/17)", "Notarized Affidavit Form 3 & Family Tree (Vanshavali)"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Apply on CCVIS Portal", "Register on barti.maharashtra.gov.in CCVIS application system.", true, "CCVIS Portal"),
                        new DocumentGuideDto.StepItem(2, "Upload Detailed Genealogy", "Upload certified family tree tracing lineage to deem date ancestor.", true, "CCVIS Portal"),
                        new DocumentGuideDto.StepItem(3, "Submit Physical Dossier to Committee", "Submit complete paper file endorsed by College Principal to District Scrutiny Committee.", false, "District Scrutiny Committee"),
                        new DocumentGuideDto.StepItem(4, "Receive Digital Validity", "Download verified Caste Validity Certificate with security QR code.", true, "CCVIS Portal")
                ))
                .build());

        // 5. Non-Creamy Layer
        guides.add(DocumentGuideDto.builder()
                .id(5L)
                .documentType("NON_CREAMY_LAYER")
                .title("Non-Creamy Layer Certificate (NCL) (नॉन-क्रिमीलेअर प्रमाणपत्र)")
                .simpleDescription("Certificate issued to OBC/VJNT/SBC/SEBC beneficiaries certifying that household income has remained under ₹8 Lakhs for past 3 consecutive financial years.")
                .issuingAuthority("Sub-Divisional Officer / Tehsildar")
                .applicableState("Maharashtra")
                .possibleFees("₹33.00")
                .estimatedTime("21 working days")
                .officialUrl("https://aaplesarkar.mahaonline.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Past 3 years Income Proof (ITR / Form 16 / Tahsildar certificate)", "Caste Certificate copy", "Ration Card", "Affidavit Form 2"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Submit Aaple Sarkar Form", "Select Revenue Services -> Non-Creamy Layer Certificate.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(2, "Declare 3 Years Income", "Enter income breakdown for past 3 financial years.", true, "Aaple Sarkar"),
                        new DocumentGuideDto.StepItem(3, "Receive Valid 3-Year Certificate", "Pay ₹33 and download NCL certificate valid through March 31 of third fiscal year.", true, "Aaple Sarkar")
                ))
                .build());

        // 6. 7/12 & 8A Land Extract
        guides.add(DocumentGuideDto.builder()
                .id(6L)
                .documentType("SEVEN_TWELVE_EXTRACT")
                .title("7/12 & 8A Land Extract (सातबारा व ८-अ उतारा)")
                .simpleDescription("Legal land record extract from Maharashtra Land Revenue Code specifying land ownership, cultivator rights, survey/gat numbers, and crop area.")
                .issuingAuthority("Revenue & Forest Department, Maharashtra (Bhulekh Mahabhumi)")
                .applicableState("Maharashtra")
                .possibleFees("₹15.00 per digital signed copy")
                .estimatedTime("Instant (Real-Time Download)")
                .officialUrl("https://digitalsatbara.mahabhumi.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("District, Taluka, and Village name", "Survey Number or Gat Number", "Mobile number for OTP login"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Open Digital Satbara Portal", "Navigate to digitalsatbara.mahabhumi.gov.in and login.", true, "Digital Satbara Portal"),
                        new DocumentGuideDto.StepItem(2, "Recharge Citizen Wallet", "Pay ₹15 via UPI or debit card to create balance.", true, "Payment Gateway"),
                        new DocumentGuideDto.StepItem(3, "Search by Gat Number", "Select District -> Taluka -> Village and input Gat Number.", true, "Digital Satbara Portal"),
                        new DocumentGuideDto.StepItem(4, "Download Legally Valid 7/12", "Instantly download digital signed 7/12 & 8A extract containing ULPIN barcode.", true, "Digital Satbara Portal")
                ))
                .build());

        // 7. Udyam MSME Registration
        guides.add(DocumentGuideDto.builder()
                .id(7L)
                .documentType("UDYAM_REGISTRATION")
                .title("Udyam MSME Registration Certificate (उद्यम नोंदणी)")
                .simpleDescription("Official Central Government recognition certificate for Micro, Small, and Medium Enterprises required for Mudra loans, CMEGP/PMEGP capital subsidies, and government tender priority.")
                .issuingAuthority("Ministry of Micro, Small and Medium Enterprises (MSME), Govt of India")
                .applicableState("All India")
                .possibleFees("₹0 (Completely Free on Official Portal - Beware of Fraud Charge Sites)")
                .estimatedTime("1 to 2 working days")
                .officialUrl("https://udyamregistration.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Aadhaar Card of proprietor/promoter (mobile linked)", "PAN Card of owner / firm", "Bank Account Number & IFSC", "NIC Business Activity description"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Visit Official Udyam Portal", "Open udyamregistration.gov.in (Verify .gov.in URL).", true, "Udyam Portal"),
                        new DocumentGuideDto.StepItem(2, "Authenticate with Aadhaar & PAN", "Enter Aadhaar number and PAN; verify via instant mobile OTP.", true, "Udyam Portal"),
                        new DocumentGuideDto.StepItem(3, "Enter Enterprise Details", "Enter plant/shop location, investment amount, and number of workers.", true, "Udyam Portal"),
                        new DocumentGuideDto.StepItem(4, "Download Certificate with QR", "Receive permanent Udyam Registration Number and certificate with QR verification.", true, "Udyam Portal")
                ))
                .build());

        // 8. College Bonafide Certificate
        guides.add(DocumentGuideDto.builder()
                .id(8L)
                .documentType("BONAFIDE_CERTIFICATE")
                .title("College Bonafide Certificate & Fee Receipt")
                .simpleDescription("Official certificate on college letterhead certifying active student enrollment, course name, current semester/year, and approved fee structure.")
                .issuingAuthority("Principal / Registrar of Enrolled College or University")
                .applicableState("All India")
                .possibleFees("₹0 to ₹50 (as per college administrative fee)")
                .estimatedTime("1 to 2 working days")
                .officialUrl("College Academic Student ERP")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("College Identity Card", "Current year fee payment receipt", "Admission confirmation letter"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Submit Application to Student Section", "Fill bonafide requisition slip stating purpose: 'Government Scholarship Application'.", false, "College Student Section"),
                        new DocumentGuideDto.StepItem(2, "Verification of Admission", "College clerk verifies enrollment record and academic fee receipts.", false, "College Admin Office"),
                        new DocumentGuideDto.StepItem(3, "Collect Principal Endorsed Document", "Collect original bonafide bearing college seal, registration number, and Principal signature.", false, "College Admin Office")
                ))
                .build());

        // 9. Digital Ration Card
        guides.add(DocumentGuideDto.builder()
                .id(9L)
                .documentType("RATION_CARD")
                .title("Digital Ration Card / Family Card (रेशन कार्ड)")
                .simpleDescription("Official food security and family composition identity document categorizing households into Antyodaya, BPL (Yellow), or APL (Orange).")
                .issuingAuthority("Food, Civil Supplies and Consumer Protection Department")
                .applicableState("Maharashtra")
                .possibleFees("₹20.00 to ₹50.00")
                .estimatedTime("30 working days")
                .officialUrl("https://rcms.mahafood.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Aadhaar Card of all family members", "Income proof / Tahsildar certificate", "Electricity bill or rent agreement", "LPG gas connection cylinder passbook"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Apply Online on RCMS Portal", "Visit rcms.mahafood.gov.in and fill Form 1.", true, "RCMS MahaFood"),
                        new DocumentGuideDto.StepItem(2, "Upload Member Aadhaar Details", "Link 12-digit Aadhaar for all members for NFSA grain entitlement.", true, "RCMS MahaFood"),
                        new DocumentGuideDto.StepItem(3, "Food Supply Officer (FSO) Verification", "FSO verifies residence; download e-Ration card with RC number.", false, "FSO Office")
                ))
                .build());

        // 10. Bank Account Aadhaar Seeding (NPCI / DBT)
        guides.add(DocumentGuideDto.builder()
                .id(10L)
                .documentType("BANK_AADHAAR_SEEDING")
                .title("Bank Account Aadhaar Seeding (NPCI Mapping for DBT)")
                .simpleDescription("Mandatory linkage of your bank savings account with the National Payments Corporation of India (NPCI) mapper to receive direct government cash transfers (PM-KISAN, EBC Scholarships, Ladki Bahin).")
                .issuingAuthority("Bank Branch Manager & NPCI (National Payments Corporation of India)")
                .applicableState("All India")
                .possibleFees("₹0 (Completely Free)")
                .estimatedTime("24 to 48 hours")
                .officialUrl("https://myaadhaar.uidai.gov.in")
                .verificationStatus("VERIFIED")
                .prerequisites(List.of("Original Aadhaar Card", "Bank Passbook copy", "Aadhaar Seeding Mandate Consent Form"))
                .steps(List.of(
                        new DocumentGuideDto.StepItem(1, "Download NPCI Mandate Form", "Obtain 'Application for Linkage of Aadhaar Number to Bank Account for DBT' from your bank.", false, "Bank Branch"),
                        new DocumentGuideDto.StepItem(2, "Submit Form with Passbook Copy", "Hand in form with self-attested Aadhaar photocopy to your bank branch service desk.", false, "Bank Branch"),
                        new DocumentGuideDto.StepItem(3, "Verify Status on UIDAI Portal", "Visit myaadhaar.uidai.gov.in -> 'Bank Seeding Status' to confirm active NPCI mapping.", true, "UIDAI Portal")
                ))
                .build());
    }
}
