Cybersecurity Plan for VeloPay Solutions
Capstone Project


1. Executive Summary

VeloPay Solutions is a 45-person FinTech and payment processing company experiencing rapid growth. The organization currently uses:

* Windows Server 2019 Active Directory
* QuickBooks Desktop Multi-user Mode
* Microsoft 365 Business Premium
* AWS S3 Storage
* UniFi Networking Infrastructure

However, the company faces serious cybersecurity weaknesses including:

* Flat network architecture
* Lack of network segmentation
* Excessive administrator privileges
* No centralized monitoring
* Weak remote access controls
* No formal incident response plan

This cybersecurity plan is designed to:

* Improve security posture
* Meet PCI-DSS compliance requirements
* Protect customer financial data
* Support hybrid work securely
* Reduce the risk of ransomware and phishing attacks
* Align with the NIST Cybersecurity Framework (CSF)


2. Business Problems Identified
 Current Security Weaknesses

Problem                            Risk                               
Flat network                      Easy lateral movement for attackers 
Guest Wi-Fi not isolated    Exposure of payment systems         
All users have admin rights | Malware escalation                  
No SIEM/log monitoring      Threats remain undetected           
Weak remote security        Account compromise                  
No incident response plan   Slow recovery from attacks          


3. NIST Cybersecurity Framework Alignment

The solution follows the five NIST CSF functions.

NIST Function  Implementation                    
Identify          Asset inventory and risk analysis 
Protect        MFA, VLANs, endpoint protection  
Detect           SIEM and centralized logging      
Respond        Incident response procedures      
Recover       Backup and disaster recovery      



4. Proposed Secure Network Architecture

 System Architecture Overview

`text id="arch01"
Internet
   ↓
UniFi Dream Machine Pro Firewall
   ↓
Core Managed Switch
   ├── VLAN 10 – Staff Network
   ├── VLAN 20 – QuickBooks/Production Server
   ├── VLAN 30 – Guest Wi-Fi
   ├── VLAN 40 – IoT Devices
   └── VLAN 50 – Management/Admin

 5. VLAN and Network Segmentation Strategy

VLAN Assignments

VLAN    Purpose                 Subnet       
VLAN10  Staff Devices      10.0.10.0/24 |
VLAN20  QuickBooks Server 10.0.20.0/24 
VLAN30  Guest Wi-Fi         10.0.30.0/24 
VLAN40   IoT Devices        10.0.40.0/24 
VLAN50  IT Administration  10.0.50.0/24 

 Segmentation Goals

* Separate guest traffic from business systems
* Protect QuickBooks financial database
* Reduce ransomware spread
* Control communication between departments

6. Firewall and ACL Configuration
 Firewall Security Rules

Source          Destination                  Action              
VLAN10 Staff  VLAN20 QuickBooks Allow approved ports 
VLAN30 Guest  Internal VLANs    Deny                 
 VLAN40 IoT     Internal Network    Deny                 
VPN Users     VLAN10 Only          Allow with MFA       
Firewall Rule Example

```json id="fw01"
{
  "rule_name": "Restrict_QB_Access",
  "source_network": "VLAN10_STAFF",
  "destination_ip": "10.0.20.5",
  "ports": ["8019", "55368"],
  "action": "allow",
  "description": "Allow only staff VLAN access to QuickBooks Database"
}


 7. Identity and Access Management (IAM)

Security Objectives

* Remove permanent local admin rights
* Enforce Multi-Factor Authentication (MFA)
* Implement Zero Trust access policies


MFA Implementation

Service              MFA Required
Microsoft 365       Yes          
VPN Access        Yes          
Admin Accounts   Yes          
AWS Access       Yes          

Conditional Access Policies

* Block login from unknown countries
* Require compliant devices
* Require MFA for remote access
* Detect impossible travel logins

8. Endpoint Security and Device Management

 Tools Used
Tool               Purpose            
Microsoft Intune       Device management  
Microsoft Defender    Endpoint protection 
BitLocker                    Disk encryption     

Endpoint Policies

Policy               Requirement
Full disk encryption    Enabled     
Antivirus                     Enabled     
 Automatic updates    Required    
 USB restrictions        Enabled     
Screen lock timeout   5 minutes  

9. Least Privilege Implementation

 Current Issue

Employees currently have permanent administrator access.

Security Improvements

Action                                  Benefit                     
Remove local admin rights    Prevent malware escalation    
Role-based access control    Limit unnecessary permissions 
Privileged access management  Secure admin tasks            

10. Hybrid Workforce Security

Remote Access Solution

 Component      Security Measure            

VPN                   WireGuard VPN               
Authentication  MFA with Number Matching    
Remote Devices  Intune managed only        
 Access Control     Conditional Access Policies

 11. SIEM and Centralized Logging

 Logging Infrastructure

Source                Logged Events        

Windows Server   Login events         
UniFi Firewall    Network traffic     
Microsoft 365    Email threats        
 AWS S3            File access activity 

 SIEM Platform

Microsoft Sentinel will provide:

* Real-time monitoring
* Automated alerts
* Threat correlation
* Centralized dashboards



12. Automated Threat Detection

High Severity Alerts

Alert                                 Trigger             
Multiple failed logins     Brute-force attack  
Large S3 downloads      Possible data theft 
 PowerShell abuse       Malware activity   
VPN login without MFA  Unauthorized access 


13. AWS S3 Security Controls

 Security Enhancements

 Control                     Purpose              
 IAM role restrictions  Least privilege       
 Encryption                Protect stored files  
CloudTrail logging    Monitor access        
Versioning            Recover deleted files


14. Incident Response Plan

Incident Response Lifecycle

|Phase              Activity                 
Preparation     Security training      
Identification     Detect incidents         
Containment     Isolate affected systems
Eradication       Remove malware           
Recovery         Restore operations       
Lessons Learned | Improve controls         

 Incident Response Team

|Role                    Responsibility        
IT Manager         Incident coordination  
CFO                   Executive communication 
Security Consultant  Technical support       
HR                       Employee communication  

15. Backup and Recovery Strategy

Backup Plan

System                        Frequency              
QuickBooks Database Hourly                 
Windows Server          Daily                  
Microsoft 365 Data.     Daily                 
AWS S3 Data              Continuous replication 


## Backup Security

* Encrypted backups
* Offline backup copies
* Immutable cloud storage
* Routine recovery testing

---

# 16. PCI-DSS Compliance Support

## PCI-DSS Controls Implemented

| PCI Requirement        | Security Solution  |
| ---------------------- | ------------------ |
| Network segmentation   | VLANs              |
| Access control         | MFA and RBAC       |
| Logging and monitoring | SIEM               |
| Secure systems         | Endpoint hardening |
| Incident response      | IR procedures      |

 17. Budget Planning

Estimated Security Costs

Item                                 Cost  

UniFi Security Upgrades   $2,000 
 Microsoft Sentinel            $2,500 
Backup Storage                $1,500
 Security Consultant         $4,000 
 Employee Training           $1,000 
Additional Hardware          $2,000 

Total Estimated Budget

`text id="budget01"
Estimated Total Cost: $13,000 – $14,500

The solution remains within the $15,000 project limit.

 18. Implementation Phases
Phase 1 – Network Hardening

* Configure VLANs
* Deploy firewall ACLs
* Isolate guest Wi-Fi
* Configure VPN access

Phase 2 – Identity and Endpoint Governance

* Enable MFA
* Remove local admin rights
* Deploy Intune policies
* Configure BitLocker

Phase 3 – Monitoring and Visibility

* Deploy Microsoft Sentinel
* Configure centralized logging
* Implement automated alerts
* Test incident response

19. Success Metrics

Metric                                        Target          
Permanent local admin accounts  0                
MFA coverage                             100%             
Guest Wi-Fi isolation                  Complete         
Mean Time to Detect (MTTD)     Under 15 minutes 
AWS S3 logging visibility       Enabled         
PCI-DSS audit readiness        Achieved         

20. Expected Business Outcomes

Outcome                        Benefit                      
Improved client trust        Banking partnership approval 
 Reduced cyber risk        Better resilience            
Faster incident detection Reduced downtime             
Compliance readiness      Avoid penalties              
Secure hybrid work         Protected remote employees   

21. Conclusion

This cybersecurity plan transforms VeloPay Solutions from an insecure startup-style environment into a secure, audit-ready enterprise infrastructure.

The implementation of:

* VLAN segmentation
* Least privilege access
* MFA enforcement
* SIEM monitoring
* Endpoint management
* Secure remote access
* Incident response planning

will significantly reduce cybersecurity risks while supporting business growth, PCI-DSS compliance, and secure hybrid operations.

