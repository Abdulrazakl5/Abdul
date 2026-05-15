# Installation & Implementation Guide

## VeloPay Solutions Cybersecurity Implementation Roadmap

### Overview

This guide provides a week-by-week implementation plan for deploying the VeloPay Cybersecurity Plan across 16 weeks, organized in three phases.

**Total Duration:** 16 weeks (4 months)
**Total Budget:** $13,000–$14,500
**Team Size:** IT Manager, Security Consultant, System Administrator

---

## Pre-Implementation Checklist

- [ ] Executive approval and budget authorization
- [ ] Project team assembly and role assignment
- [ ] Stakeholder communication and training schedule
- [ ] Network documentation and asset inventory
- [ ] Backup of all critical systems
- [ ] Testing environment setup
- [ ] Maintenance window scheduling
- [ ] Rollback procedures documented

---

## PHASE 1: NETWORK HARDENING (Weeks 1-6)

### Objective
Segment the network, isolate guest traffic, and secure remote access with VPN.

### Week 1: Planning & Discovery

**Tasks:**
1. Document existing network topology
2. Inventory all devices and VLANs
3. Create firewall ACL matrix
4. Schedule maintenance windows

**Deliverables:**
- Network diagram with device count per VLAN
- ACL requirements spreadsheet
- Change management tickets

**Success Criteria:**
- Complete device inventory (100% documented)
- ACL matrix approved by IT leadership

---

### Week 2-3: VLAN Configuration

**Tasks:**
1. Configure VLAN 10 (Staff Devices) - 10.0.10.0/24
2. Configure VLAN 20 (QuickBooks/Production) - 10.0.20.0/24
3. Configure VLAN 30 (Guest Wi-Fi) - 10.0.30.0/24
4. Configure VLAN 40 (IoT Devices) - 10.0.40.0/24
5. Configure VLAN 50 (Admin/IT) - 10.0.50.0/24
6. Test inter-VLAN communication

**Configuration Details:**

```
VLAN 10 - Staff Network
├── Subnet: 10.0.10.0/24
├── Gateway: 10.0.10.1
├── DHCP: 10.0.10.5-10.0.10.254
├── Devices: Workstations, laptops
└── Access: Internal business apps

VLAN 20 - Production/QuickBooks
├── Subnet: 10.0.20.0/24
├── Gateway: 10.0.20.1
├── DHCP: Disabled (static IPs only)
├── Devices: QuickBooks server, financial database
└── Access: Restricted to authorized staff

VLAN 30 - Guest Wi-Fi
├── Subnet: 10.0.30.0/24
├── Gateway: 10.0.30.1
├── DHCP: 10.0.30.5-10.0.30.254
├── Devices: Guest devices only
└── Access: Internet only (no internal access)

VLAN 40 - IoT Devices
├── Subnet: 10.0.40.0/24
├── Gateway: 10.0.40.1
├── DHCP: 10.0.40.5-10.0.40.254
├── Devices: Printers, cameras, sensors
└── Access: Minimal (update servers only)

VLAN 50 - IT Administration
├── Subnet: 10.0.50.0/24
├── Gateway: 10.0.50.1
├── DHCP: Disabled (static IPs)
├── Devices: Admin workstations, security appliances
└── Access: All systems for management
```

**Deliverables:**
- VLAN configuration backup
- Network diagram showing all VLANs
- DHCP scope configuration

**Success Criteria:**
- All 5 VLANs created and verified
- Inter-VLAN routing tested
- No communication breakage

---

### Week 4: Firewall ACL Deployment

**Tasks:**
1. Configure UniFi Dream Machine Pro firewall rules
2. Implement access control lists (ACLs)
3. Test firewall rules
4. Document all rules

**Firewall Rules:**

| Source | Destination | Action | Ports | Priority |
|--------|-------------|--------|-------|----------|
| VLAN10 | VLAN20 | Allow | 3306, 1433, 445 | High |
| VLAN10 | VLAN30 | Deny | All | High |
| VLAN10 | VLAN40 | Allow | 9100, 631 | Medium |
| VLAN10 | VLAN50 | Deny | All | High |
| VLAN20 | VLAN10 | Allow | 80, 443 | Medium |
| VLAN30 | Internal | Deny | All | Critical |
| VLAN40 | External | Allow | 443 (updates) | Low |
| VPN Users | VLAN10 | Allow | 443, 3389, 22 | High |
| VPN Users | VLAN20 | Deny | All | Critical |
| External | Internal | Deny | All | Critical |

**Deliverables:**
- Firewall ACL export
- Rule documentation
- Traffic flow diagrams

**Success Criteria:**
- All rules deployed and tested
- No blocked legitimate traffic
- Guest traffic isolated

---

### Week 5: Guest Wi-Fi Isolation & VPN Setup

**Tasks:**
1. Configure guest Wi-Fi on VLAN 30
2. Set up WireGuard VPN server
3. Configure VPN routing rules
4. Generate VPN client configurations
5. Test remote access

**Guest Wi-Fi Configuration:**
```
SSID: VeloPay-Guest
Authentication: WPA2/WPA3
Encryption: AES-256
Bandwidth: Limited to 10 Mbps per device
Isolation: Enabled
Guest Portal: Enabled with terms acceptance
VLAN: 30
Isolation Rules:
  - Cannot access VLAN10, 20, 40, 50
  - Can access Internet gateway only
  - Session timeout: 8 hours
  - Device limit: 50 concurrent
```

**VPN Configuration:**
```
Protocol: WireGuard
Port: 51820/UDP
Encryption: ChaCha20-Poly1305
Authentication: Public key cryptography
MFA: Required
Allowed IPs: 10.0.10.0/24 (staff only)
Session Timeout: 4 hours
Kill Switch: Enabled
DNS: Internal (10.0.10.1)
```

**Deliverables:**
- Guest Wi-Fi configuration
- VPN server setup
- Client configuration files
- VPN user guide

**Success Criteria:**
- Guest Wi-Fi accessible and isolated
- VPN connecting successfully
- No VLAN 30 to internal access

---

### Week 6: Testing & Rollout

**Tasks:**
1. Comprehensive network testing
2. Penetration testing of firewall rules
3. Document any issues
4. Final adjustments
5. Phase 1 sign-off

**Test Scenarios:**
- [ ] Staff can access business apps
- [ ] Guest cannot access internal resources
- [ ] IoT devices can reach update servers
- [ ] Admin can manage all VLANs
- [ ] VPN users can access VLAN 10
- [ ] QuickBooks only accessible to authorized users

**Deliverables:**
- Test report with results
- Performance baseline
- Issues log with resolutions

**Success Criteria:**
- All tests pass
- No security bypass identified
- Performance acceptable

---

## PHASE 2: IDENTITY & ENDPOINT GOVERNANCE (Weeks 7-12)

### Objective
Implement MFA, remove admin rights, deploy endpoint protection, and encrypt all devices.

### Week 7: MFA Implementation

**Tasks:**
1. Enable MFA for Microsoft 365
2. Configure MFA for VPN access
3. Set up Conditional Access policies
4. Distribute authenticator apps to staff

**MFA Configuration:**

**Microsoft 365 MFA:**
```
Required Services:
  - Email (Outlook)
  - SharePoint/OneDrive
  - Teams
  - Admin portal

MFA Methods:
  - Microsoft Authenticator (preferred)
  - SMS (backup)
  - FIDO2 keys (for admins)

Conditional Access:
  - Require MFA from unknown locations
  - Require MFA for admin accounts (always)
  - Require compliant devices
  - Block legacy authentication
  - Risk-based access
```

**VPN MFA:**
```
MFA Provider: Microsoft Entra ID
Methods:
  - Push notification (preferred)
  - TOTP code
  - Number matching

Requirements:
  - All remote connections
  - Mandatory for all users
```

**Deliverables:**
- MFA policy document
- Conditional Access rules
- User guide for authenticator
- Rollout schedule

**Success Criteria:**
- 100% MFA enrollment
- No access without MFA
- User training completed

---

### Week 8-9: Remove Local Admin Rights

**Tasks:**
1. Conduct admin rights audit
2. Create privileged access group
3. Remove permanent admin rights
4. Implement Just-In-Time (JIT) admin
5. Set up admin approval workflows

**Admin Rights Removal:**
```
Phase 1 (Week 8):
  - Identify all admins (target: document 100%)
  - Notify staff of changes
  - Create PAM (Privileged Access Management) groups
  - Begin selective removal

Phase 2 (Week 9):
  - Complete removal for standard users
  - Implement JIT elevation
  - Monitor and adjust
  - Handle exceptions
```

**Privileged Access Management:**
```
Tools: Microsoft Entra Privileged Identity Management

Workflow:
  1. User requests admin access
  2. Manager receives approval request
  3. Manager approves/denies
  4. Access granted for limited duration (4 hours)
  5. Access automatically revoked
  6. Action logged and audited
```

**Deliverables:**
- Admin audit report
- PAM configuration
- Approval workflow documentation
- Staff communication

**Success Criteria:**
- Zero permanent local admins
- PAM system operational
- <5% access denial exceptions

---

### Week 10: Intune Policy Deployment

**Tasks:**
1. Enroll all devices in Intune
2. Configure device compliance policies
3. Deploy configuration profiles
4. Test policy enforcement

**Intune Policies:**

**Windows Device Compliance:**
```
BitLocker: Required
  - Drive encryption: On
  - Recovery key storage: Required
  - Escrow recovery key: Enabled

Antivirus:
  - Defender: Required
  - Real-time scanning: Enabled
  - Signature updates: Daily
  - Quarantine: Automatic

Firewall:
  - Windows Defender Firewall: Required
  - Domain profile: On
  - Private profile: On
  - Public profile: On

Updates:
  - Auto-update: Enabled
  - Update frequency: Monthly (second Tuesday)
  - Restart: Required
  - Defer period: 0 days

Device Security:
  - UEFI firmware: Required
  - Secure boot: Enabled
  - TPM: Required (2.0)
  - DMA protection: Enabled
```

**Deliverables:**
- Intune enrollment report
- Policy configuration export
- Compliance dashboard setup
- Remediation procedures

**Success Criteria:**
- 100% device enrollment
- >95% compliance
- All policies applied

---

### Week 11-12: BitLocker Encryption & Final Setup

**Tasks:**
1. Deploy BitLocker encryption
2. Manage recovery keys
3. Encrypt external drives
4. Configure backup solutions
5. Phase 2 testing and sign-off

**BitLocker Configuration:**
```
Drive Encryption:
  - All internal drives: Required
  - Encryption level: XTS-AES 256
  - Password: 20+ characters
  - TPM PIN: Required for admins
  - USB startup key: Disabled

Recovery:
  - Key escrow: Azure AD
  - Backup location: OneDrive
  - Recovery password: Printed and stored

External Drives:
  - Detection: Automatic
  - Encryption: Mandatory
  - Password: User-set
```

**Deliverables:**
- BitLocker deployment report
- Recovery key storage documentation
- Backup procedures
- Encryption verification report

**Success Criteria:**
- All drives encrypted
- Recovery keys stored
- Phase 2 complete

---

## PHASE 3: MONITORING & VISIBILITY (Weeks 13-16)

### Objective
Deploy SIEM, centralize logging, create alerts, and test incident response.

### Week 13: Microsoft Sentinel Deployment

**Tasks:**
1. Create Azure Log Analytics workspace
2. Deploy Sentinel instance
3. Configure data connectors
4. Set up analytics rules

**Connectors:**
```
1. Windows Security Events
   - Log Analytics Agent
   - All events from VLANs
   - Forwarding rule: All

2. UniFi Firewall
   - Syslog integration
   - Parse firewall logs
   - Track all blocked/allowed

3. Microsoft 365
   - Office 365 connector
   - Exchange online logs
   - SharePoint access
   - Teams activity

4. AWS S3
   - CloudTrail logs
   - S3 access logs
   - IAM activity

5. Azure AD
   - Sign-in logs
   - Audit logs
   - Risk detections
```

**Deliverables:**
- Sentinel workspace setup
- Data connector configuration
- Query library
- Initial dashboards

**Success Criteria:**
- All data sources connected
- Logs ingesting successfully
- No data gaps

---

### Week 14: Analytics Rules & Alerts

**Tasks:**
1. Create detection rules
2. Configure alert thresholds
3. Set up automated playbooks
4. Create incident procedures

**Critical Detection Rules:**

**Rule 1: Brute Force Attack**
```
Condition: 5+ failed logins within 10 minutes
Source: Same user or IP
Trigger: Alert + Auto-disable account
Notification: IT Manager + Security Team
Severity: High
```

**Rule 2: Unauthorized VLAN Access**
```
Condition: Traffic from VLAN 30 to VLAN 10/20
Trigger: Alert immediately
Notification: Network admin
Severity: Critical
Response: Block traffic + Investigate
```

**Rule 3: Large S3 Download**
```
Condition: >1GB download from S3 in 1 hour
Trigger: Alert for review
Notification: Data security officer
Severity: Medium-High
Response: Verify legitimacy
```

**Rule 4: PowerShell Abuse**
```
Condition: Encoded PowerShell execution
Trigger: Alert immediately
Notification: Incident response team
Severity: Critical
Response: Isolate system + Investigate
```

**Rule 5: VPN Access Without MFA**
```
Condition: VPN connection without MFA
Trigger: Deny connection
Notification: IT Manager
Severity: Critical
Response: Block user + Verify identity
```

**Automated Playbooks:**

```
Playbook 1: Brute Force Response
  1. Send alert notification
  2. Disable user account
  3. Force password reset
  4. Require MFA re-enrollment
  5. Notify user of incident
  6. Log incident ticket

Playbook 2: Malware Detection
  1. Alert security team
  2. Isolate affected device
  3. Block network access
  4. Initiate forensics
  5. Quarantine files
  6. Create incident ticket

Playbook 3: Data Exfiltration
  1. Alert immediately
  2. Block S3 access
  3. Disable user account
  4. Preserve logs
  5. Contact compliance
  6. Begin investigation
```

**Deliverables:**
- Detection rules documentation
- Alert thresholds
- Playbook configurations
- Alert testing results

**Success Criteria:**
- All rules deployed
- Zero false positives acceptable
- Playbooks functional

---

### Week 15: Dashboards & Reporting

**Tasks:**
1. Create executive dashboard
2. Create operational dashboard
3. Set up automated reports
4. Configure metrics tracking

**Executive Dashboard:**
```
Key Metrics:
  - Security Score
  - Incidents (Last 30 days)
  - Compliance Status
  - Risk Trend
  - MTTR (Mean Time to Respond)
  - Detection Rate
```

**Operational Dashboard:**
```
Real-time Monitoring:
  - Active alerts (critical)
  - Failed logins (hourly)
  - Network anomalies
  - Device compliance
  - VPN connections
  - S3 access patterns
  - Firewall blocks
```

**Deliverables:**
- Dashboard definitions
- Query library (KQL)
- Report templates
- Scheduler configuration

**Success Criteria:**
- Dashboards display accurate data
- Reports scheduled and sent
- Metrics tracked consistently

---

### Week 16: Testing & Go-Live

**Tasks:**
1. Incident response drills
2. Full system testing
3. Penetration testing
4. Final documentation
5. Project sign-off

**Incident Response Drills:**

**Drill 1: Ransomware Scenario**
```
Scenario: Malware detected on workstation
Time Limit: 1 hour to respond
Expected Actions:
  1. Detect malware (Sentinel alert)
  2. Isolate device (Intune)
  3. Disable user account (PAM)
  4. Begin forensics
  5. Notify management
  6. Assess backup integrity
```

**Drill 2: Data Breach Scenario**
```
Scenario: Unauthorized S3 access detected
Time Limit: 30 minutes
Expected Actions:
  1. Alert triggered (Sentinel)
  2. Verify legitimacy
  3. Disable S3 access
  4. Preserve logs
  5. Notify legal/compliance
  6. Begin investigation
```

**Drill 3: Insider Threat Scenario**
```
Scenario: Terminated employee attempting VPN access
Time Limit: 15 minutes
Expected Actions:
  1. Access denied (MFA)
  2. Alert generated
  3. Account disabled
  4. Log reviewed
  5. Incident escalated
  6. Law enforcement notified (if needed)
```

**Deliverables:**
- Incident response test results
- Penetration test report
- Remediation log
- Final implementation documentation
- Sign-off approval form

**Success Criteria:**
- All drills completed successfully
- Response times <MTTD targets
- No critical issues identified
- Stakeholder approval

---

## Post-Implementation

### Week 17+: Continuous Operations

**Ongoing Tasks:**
- Weekly security reviews
- Monthly compliance audits
- Quarterly penetration testing
- Annual policy updates
- Continuous staff training
- Incident response improvements

**Maintenance Schedule:**
- Daily: Monitor dashboards
- Weekly: Review alerts and incidents
- Monthly: Patch management
- Quarterly: Compliance review
- Annually: Comprehensive audit

---

## Success Metrics

| Metric | Target | Achieved |
|--------|--------|----------|
| Permanent local admin accounts | 0 | _____ |
| MFA coverage | 100% | _____ |
| Guest Wi-Fi isolation | Complete | _____ |
| Mean Time to Detect (MTTD) | <15 min | _____ |
| Mean Time to Respond (MTTR) | <30 min | _____ |
| AWS S3 logging | Enabled | _____ |
| PCI-DSS audit readiness | Achieved | _____ |
| Employee training completion | 100% | _____ |

---

## Troubleshooting Guide

### Common Issues & Resolution

**Issue: Devices cannot join corporate Wi-Fi after VLAN setup**
- Check DHCP scope for VLAN 10
- Verify device certificates
- Restart Wi-Fi adapter
- Check firewall rules

**Issue: VPN clients cannot connect**
- Verify WireGuard service running
- Check client configuration
- Validate firewall port (51820/UDP)
- Confirm MFA settings

**Issue: Excessive false positive alerts**
- Tune alert thresholds
- Add whitelisting rules
- Review baseline traffic
- Adjust time windows

**Issue: BitLocker recovery key not escrowed**
- Verify Azure AD connectivity
- Check Intune policy deployment
- Force device sync
- Manual key recovery if needed

---

## Support & Escalation

**Level 1:** IT Help Desk
- Network connectivity
- Device enrollment
- Password resets
- General support

**Level 2:** System Administrator
- Firewall configuration
- VLAN troubleshooting
- Policy deployment
- Device compliance

**Level 3:** Security Consultant
- Incident response
- Compliance issues
- Alert tuning
- Architecture changes

**Escalation Path:**
1. Help Desk → System Admin → Security Consultant → IT Manager → Executive

---

## References & Resources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [PCI DSS Standard](https://www.pcisecuritystandards.org/)
- [Microsoft 365 Security Documentation](https://learn.microsoft.com/en-us/microsoft-365/security/)
- [UniFi Networking Documentation](https://unifi-network.ui.com/)
- [Azure Sentinel Documentation](https://learn.microsoft.com/en-us/azure/sentinel/)

---

**Implementation Approved By:** _____________________ **Date:** _______

**Security Lead:** _____________________ **Date:** _______

**IT Manager:** _____________________ **Date:** _______
