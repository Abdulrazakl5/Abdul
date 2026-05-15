# Technical Architecture & Configuration Guide

## VeloPay Solutions Network Architecture

### System Overview

```
                          Internet (ISP)
                              |
                              |
                    UniFi Dream Machine Pro
                      (Firewall/Router)
                              |
                    ┌─────────┼─────────┐
                    |                   |
             Core Managed          UniFi AP Pro
             Switch (24 Port)      (Guest Wi-Fi)
                    |
        ┌───────────┼───────────┬───────────┬───────────┐
        |           |           |           |           |
 n    VLAN 10      VLAN 20     VLAN 30    VLAN 40    VLAN 50
    (Staff)    (Production) (Guest Wi-Fi) (IoT)    (Admin)
   10.0.10.0   10.0.20.0    10.0.30.0   10.0.40.0  10.0.50.0
```

---

## Network Segmentation - VLAN Configuration

### VLAN 10: Staff Network (Employees)

**Purpose:** General employee workstations and laptops

**Configuration:**
```
VLAN ID:           10
Name:              Staff-Network
Subnet:            10.0.10.0/24
Gateway:           10.0.10.1
DHCP Range:        10.0.10.5 - 10.0.10.254
DHCP Lease:        8 hours
DNS Primary:       10.0.10.1 (internal)
DNS Secondary:     8.8.8.8
Description:       Employee workstations, laptops
```

**Access Controls:**
- ✅ Can reach: VLAN 20 (restricted), VLAN 40 (printers)
- ❌ Cannot reach: VLAN 30 (guest), VLAN 50 (admin)
- ✅ Internet: Yes (proxy filtered)

**Device Examples:**
- Dell/HP/Lenovo workstations
- MacBook Air/Pro
- Microsoft Surface devices
- Mobile devices (via Wi-Fi)

**Ports Used:**
- 80 (HTTP)
- 443 (HTTPS)
- 445 (SMB)
- 3389 (RDP)
- 22 (SSH)
- 3306 (MySQL)
- 1433 (SQL Server)

---

### VLAN 20: Production/QuickBooks Server

**Purpose:** Critical financial database and business applications

**Configuration:**
```
VLAN ID:           20
Name:              Production-Financial
Subnet:            10.0.20.0/24
Gateway:           10.0.20.1
DHCP:              Disabled (static IPs only)
Static Range:      10.0.20.10 - 10.0.20.50
DNS:               10.0.20.1 (internal)
Description:       QuickBooks server, financial database
Backup Gateway:    10.0.20.254 (for HA)
```

**Access Controls:**
- ✅ Can receive from: VLAN 10 (restricted ports), Backup server
- ✅ Can send to: VLAN 10 (reports), External backup
- ❌ Cannot reach: VLAN 30, 40, 50
- ❌ Internet: No (air-gapped)

**Firewall Rules for VLAN 20:**
```
Inbound:
  From VLAN 10 TCP 3306 (MySQL) - ALLOW
  From VLAN 10 TCP 1433 (SQL Server) - ALLOW
  From VLAN 10 TCP 445 (SMB) - ALLOW
  From VLAN 10 TCP 3389 (RDP) - ALLOW - WITH MFA
  From anywhere else - DENY

Outbound:
  To VLAN 10 TCP 80, 443 - ALLOW (reports)
  To external backup server - ALLOW
  To anywhere else - DENY
```

**Critical Infrastructure:**
- QuickBooks Server (Windows Server 2019)
- SQL Database Server
- Backup appliance
- UPS (Uninterruptible Power Supply)

**Backup Strategy:**
- Method: Hourly incremental
- Location: External secure storage
- Encryption: AES-256
- Retention: 30 days rolling
- Testing: Weekly restore drills

---

### VLAN 30: Guest Wi-Fi Network

**Purpose:** Isolated guest access without internal resource access

**Configuration:**
```
VLAN ID:           30
Name:              Guest-WiFi
Subnet:            10.0.30.0/24
Gateway:           10.0.30.1
DHCP Range:        10.0.30.5 - 10.0.30.254
DHCP Lease:        2 hours
DNS:               8.8.8.8, 1.1.1.1 (external only)
Maximum Devices:   50 concurrent
Bandwidth Limit:   10 Mbps per device
Wi-Fi SSID:        VeloPay-Guest
Encryption:        WPA3-Personal
Password:          Rotated monthly
```

**Security Features:**
- ✅ Client isolation enabled (devices cannot see each other)
- ✅ Portal-based captive portal with terms acceptance
- ✅ Session timeout: 8 hours
- ✅ Device tracking: MAC address logging
- ✅ Content filtering: Enabled
- ✅ Bandwidth throttling: 10 Mbps per device

**Access Restrictions:**
- ❌ Cannot reach: VLAN 10, 20, 40, 50
- ❌ Cannot reach: 10.0.0.0/8 (private networks)
- ✅ Can reach: Internet only
- ❌ Cannot reach: Common internal services (SMB, RDP, SSH)

**Firewall Rules:**
```
Outbound: DENY by default
  Allow: Internet (443, 80)
  Block: All private ranges
  Block: All internal services

Inbound: DENY all

Internal: DENY (isolation)
```

---

### VLAN 40: IoT Devices Network

**Purpose:** Printers, cameras, sensors, and IoT devices

**Configuration:**
```
VLAN ID:           40
Name:              IoT-Devices
Subnet:            10.0.40.0/24
Gateway:           10.0.40.1
DHCP Range:        10.0.40.5 - 10.0.40.254
DHCP Lease:        24 hours
DNS:               10.0.40.1 (internal)
Device Limit:      50 devices
Description:       Printers, cameras, sensors
```

**Device Inventory:**
```
Printers:
  - Xerox WorkCentre 5845: 10.0.40.10
  - Canon imagePRESS C255: 10.0.40.11
  - HP LaserJet Enterprise M555: 10.0.40.12
  - HP DesignJet T830: 10.0.40.13

Networked Cameras:
  - Hikvision DS-2CD2143G0: 10.0.40.20-25
  - Dahua IPC-HDBW2231E: 10.0.40.26-30

Sensors/IoT:
  - Environmental monitors: 10.0.40.40-45
  - Access control readers: 10.0.40.50-55
```

**Access Controls:**
- ✅ Can reach: External update servers (443)
- ✅ Can reach: NTP time servers (123)
- ✅ Can reach: Syslog servers (514)
- ✅ Can receive from: VLAN 10 (print jobs, config)
- ❌ Cannot reach: VLAN 10, 20, 50
- ❌ Internet access: Restricted to approved servers

**Firewall Rules:**
```
Inbound from VLAN 10:
  TCP 9100 (raw printing) - ALLOW
  TCP 631 (IPP printing) - ALLOW
  TCP 80, 443 (web interface) - ALLOW
  TCP 22 (SSH) - DENY

Outbound:
  To update servers - ALLOW (443)
  To NTP - ALLOW (123)
  To Syslog - ALLOW (514)
  Internet - DENY (except approved)
  Internal networks - DENY
```

**Security Measures:**
- ✅ Firmware auto-updates enabled
- ✅ Web admin password: Complex (20+ chars)
- ✅ SNMPv3 with authentication
- ✅ Default credentials: Changed
- ✅ Unnecessary services: Disabled
- ✅ Logging: Centralized to Sentinel

---

### VLAN 50: IT Administration Network

**Purpose:** IT management systems, security appliances, and admin workstations

**Configuration:**
```
VLAN ID:           50
Name:              IT-Admin
Subnet:            10.0.50.0/24
Gateway:           10.0.50.1
DHCP:              Disabled (static IPs only)
Static Range:      10.0.50.10 - 10.0.50.50
DNS:               10.0.50.1 (internal)
Domain:            velopay.local
Description:       IT systems, admin workstations, security
Management Port:   8443 (custom HTTPS)
```

**Infrastructure Components:**
```
Domain Controller:
  - Server 2019 (DC1)
  - IP: 10.0.50.10
  - Role: Primary AD, DNS, DHCP
  - Backup: DC2 (10.0.50.11)

Security Appliances:
  - Sophos Firewall: 10.0.50.20
  - Sentinel Collector: 10.0.50.21
  - Log aggregator: 10.0.50.22
  - Backup appliance: 10.0.50.23

Admin Workstations:
  - Admin PC 1: 10.0.50.30
  - Admin PC 2: 10.0.50.31
  - Bastion Host: 10.0.50.40

Network Equipment:
  - Core Switch: 10.0.50.100
  - Firewall: 10.0.50.1
  - UniFi Controller: 10.0.50.101
```

**Access Controls:**
- ✅ Can manage: All VLANs and devices
- ✅ Can access: All network infrastructure
- ✅ Can reach: Internet (restricted)
- ❌ Cannot be reached from: Any other VLAN
- ✅ All access: Logged and monitored

**Admin Access Requirements:**
- MFA: Always required
- Device: Compliant Intune-managed
- Location: On-network or VPN
- Time-based: Business hours only
- Approval: Manager approval required
- Duration: Limited to 4-hour sessions

---

## Firewall Configuration

### UniFi Dream Machine Pro Firewall Rules

**Global Rules:**
```
1. DENY ALL (default deny)
2. ALLOW established/related connections
3. Apply per-VLAN rules
```

**Rule Set: VLAN 10 (Staff) Outbound**
```
Rule 1: Allow to VLAN 20 (Business Apps)
  Source: VLAN 10 (10.0.10.0/24)
  Destination: VLAN 20 (10.0.20.0/24)
  Protocol: TCP
  Ports: 80, 443, 1433, 3306, 445, 3389
  Action: ALLOW
  Logging: Yes

Rule 2: Allow to VLAN 40 (Printers)
  Source: VLAN 10
  Destination: VLAN 40 (10.0.40.0/24)
  Protocol: TCP
  Ports: 9100, 631
  Action: ALLOW

Rule 3: Allow Internet
  Source: VLAN 10
  Destination: Any
  Protocol: TCP/UDP
  Ports: 80, 443, 53
  Action: ALLOW
  Note: Via proxy with content filtering

Rule 4: Deny to VLAN 30
  Source: VLAN 10
  Destination: VLAN 30
  Protocol: Any
  Action: DENY
  Logging: Yes

Rule 5: Deny to VLAN 50
  Source: VLAN 10
  Destination: VLAN 50
  Protocol: Any
  Action: DENY
  Logging: Yes
```

**Rule Set: VPN Users**
```
Rule 1: Allow VPN to VLAN 10
  Source: VPN Users
  Destination: VLAN 10 (10.0.10.0/24)
  Protocol: TCP
  Ports: 443, 3389, 22, 80
  Action: ALLOW - MFA Required
  Logging: Yes
  Timeout: 4 hours

Rule 2: Deny VPN to VLAN 20
  Source: VPN Users
  Destination: VLAN 20
  Action: DENY
  Note: Financial data restricted

Rule 3: Deny all other VPN access
  Source: VPN Users
  Destination: Other VLANs
  Action: DENY
```

**Rule Set: Guest Wi-Fi**
```
Rule 1: Deny guest to internal networks
  Source: VLAN 30 (10.0.30.0/24)
  Destination: 10.0.0.0/8
  Protocol: Any
  Action: DENY
  Logging: Yes

Rule 2: Block private IP ranges
  Source: VLAN 30
  Destination: 172.16.0.0/12, 192.168.0.0/16
  Action: DENY

Rule 3: Allow internet access only
  Source: VLAN 30
  Destination: Internet
  Protocol: TCP/UDP
  Ports: 80, 443, 53
  Action: ALLOW
  Rate Limit: 10 Mbps per client
```

**Rule Set: IoT Devices**
```
Rule 1: Allow update servers
  Source: VLAN 40
  Destination: External (AUS, APAC)
  Protocol: TCP
  Ports: 443 (HTTPS)
  Action: ALLOW
  Note: Approved vendors only

Rule 2: Allow NTP
  Source: VLAN 40
  Destination: 0.ubuntu.pool.ntp.org
  Protocol: UDP
  Port: 123
  Action: ALLOW

Rule 3: Allow DNS
  Source: VLAN 40
  Destination: 8.8.8.8, 8.8.4.4
  Protocol: UDP
  Port: 53
  Action: ALLOW

Rule 4: Block internal access
  Source: VLAN 40
  Destination: 10.0.0.0/8 (except 10.0.40.0/24)
  Action: DENY
  Logging: Yes
```

**Rule Set: Admin VLAN**
```
Rule 1: Allow admin to manage all networks
  Source: VLAN 50
  Destination: Any
  Protocol: TCP/UDP
  Action: ALLOW
  Logging: Yes
  Note: All actions logged

Rule 2: Deny unprivileged access
  Source: Any (except VLAN 50 + VPN with MFA)
  Destination: VLAN 50
  Action: DENY
  Logging: Yes
```

---

## VPN Configuration

### WireGuard VPN Setup

**Server Configuration:**
```
Protocol: WireGuard
Listen Port: 51820/UDP
Private Key: [Generated automatically]
Public Key: [Shared with clients]
Server Address: 10.8.0.1/24

Allowed IPs:
  - 10.8.0.0/24 (VPN network)
  - 10.0.10.0/24 (Staff VLAN only)

DNS:
  - 10.0.10.1 (internal resolver)
  - 1.1.1.1 (cloudflare backup)

MTU: 1420
Kill Switch: Enabled
Session Timeout: 4 hours
Idle Timeout: 30 minutes
```

**Client Configuration Example:**
```
[Interface]
PrivateKey = [Client private key]
Address = 10.8.0.2/32
DNS = 10.0.10.1, 1.1.1.1

[Peer]
PublicKey = [Server public key]
Endpoint = vpn.velopay.com:51820
AllowedIPs = 10.8.0.0/24, 10.0.10.0/24
PersistentKeepalive = 25
```

**MFA Integration:**
```
MFA Provider: Microsoft Entra ID
MFA Methods:
  1. Push notification (preferred)
  2. TOTP (time-based one-time password)
  3. Number matching
  4. SMS (backup)

Requirements:
  - All VPN connections require MFA
  - MFA challenge appears after key authentication
  - User has 5 minutes to approve
  - Failed MFA = connection denied
  - All attempts logged
```

---

## Microsoft Sentinel Configuration

### Data Sources & Log Ingestion

**1. Windows Security Events**
```
Collection Method: Log Analytics Agent
Connector: Windows Security Events
Frequency: Real-time
Data Types Collected:
  - Event ID 4624: Account logon
  - Event ID 4625: Account logon failure
  - Event ID 4720: User account created
  - Event ID 4722: User account enabled
  - Event ID 4732: Member added to group
  - Event ID 4724: Password change attempt
  - Event ID 5140: Network share accessed
  - Event ID 5145: Network share object checked
  - Event ID 7045: Service installed
  - Event ID 4768: Kerberos TGT requested
```

**2. UniFi Firewall Logs**
```
Collection Method: Syslog
Connector: Syslog
Port: 514/UDP
Parser: Custom KQL
Data Types:
  - Firewall blocks
  - Allowed connections
  - NAT translations
  - IDS/IPS alerts
  - VPN connections
  - Bandwidth statistics
```

**3. Microsoft 365 Logs**
```
Connector: Office 365
Data Sources:
  - Exchange Online: Email activity, threats
  - SharePoint: File access, deletions
  - Teams: Message activity, meetings
  - Azure AD: Sign-ins, audit logs
  - Defender: Threat alerts
```

**4. AWS CloudTrail**
```
Collection: S3 → Log Analytics
Connector: AWS CloudTrail
Monitored Actions:
  - S3 API calls (PutObject, GetObject, DeleteObject)
  - IAM permission changes
  - VPC modifications
  - Key management (KMS)
  - Access logs
```

**5. Azure AD Logs**
```
Connector: Azure AD
Data Types:
  - Sign-in logs (successful/failed)
  - Audit logs (object modifications)
  - Risk detections
  - Identity Protection alerts
  - Conditional Access triggers
```

### Sentinel Analytics Rules

**Rule: Multiple Failed Logins**
```
Query: 
  SecurityEvent
  | where EventID == 4625
  | where TimeGenerated > ago(10m)
  | summarize FailureCount = count() by Account
  | where FailureCount >= 5

Trigger: Threshold (5 failures in 10 minutes)
Severity: High
Alert: Yes
Response: Auto-disable account + Notify IT
TTL: 1 hour
```

**Rule: Unauthorized VLAN Access Attempt**
```
Query:
  CommonSecurityLog
  | where SourceIP startswith "10.0.30."
  | where DestinationIP startswith "10.0.10." or startswith "10.0.20."
  | where DeviceAction == "Deny"

Trigger: Any blocked connection
Severity: Critical
Alert: Yes
Response: Immediate notification + Investigation
TTL: 24 hours
```

**Rule: Large S3 Download**
```
Query:
  AWSCloudTrail
  | where EventName == "GetObject"
  | where S3Bucket contains "velopay"
  | summarize DownloadSize = sum(tolong(RequestParameters)) by UserIdentity, TimeGenerated
  | where DownloadSize > 1073741824 // 1GB

Trigger: >1GB download in 1 hour
Severity: Medium-High
Alert: Yes
Action: Review (auto-validate legitimacy)
TTL: 7 days
```

**Rule: VPN Access Without MFA**
```
Query:
  AzureActivity
  | where OperationName contains "VPN"
  | where MFAAuthUsed == false
  | where TimeGenerated > ago(5m)

Trigger: VPN connection detected
Severity: Critical
Alert: Yes
Response: Block connection + Disable account
TTL: 1 hour
```

**Rule: Powershell Encoded Command Execution**
```
Query:
  SecurityEvent
  | where EventID == 4688
  | where CommandLine contains "-EncodedCommand" or "-Encoded" or "-e"

Trigger: Encoded PowerShell detected
Severity: Critical
Alert: Yes
Action: Isolate system + Investigation + EDR scan
TTL: 24 hours
```

### Automated Playbooks

**Playbook 1: Brute Force Auto-Response**
```
Trigger: 5+ failed logins

Actions:
  1. Get alert details (Account, IP, Time)
  2. Send Teams notification
  3. Disable user account (Entra ID)
  4. Reset password (force change on next login)
  5. Create incident ticket (with full details)
  6. Send email to user (notify of compromise)
  7. Create audit log entry
  8. Wait for manual approval to re-enable

Manual Steps:
  1. IT Manager reviews incident
  2. Contacts user to verify (phone)
  3. Approves/denies account re-enablement
```

**Playbook 2: Unauthorized Network Access**
```
Trigger: Traffic from VLAN 30 to VLAN 10/20

Actions:
  1. Alert security team immediately
  2. Block source IP at firewall
  3. Disable Wi-Fi device
  4. Create critical incident
  5. Initiate forensic investigation
  6. Notify CEO/CFO (data breach protocol)
  7. Contact legal team
  8. Preserve all network logs
```

---

## Monitoring Dashboards

### Executive Dashboard KPIs

```
Metric 1: Security Posture Score
  - Calculation: (Compliant Devices / Total Devices) × 100
  - Target: 95%+
  - Updated: Real-time
  - Alert: If <90%

Metric 2: Critical Incidents (30 days)
  - Display: Count of critical severity incidents
  - Trend: 7-day moving average
  - Target: <2 per month
  - Alert: If >3 in 7 days

Metric 3: Mean Time to Detect (MTTD)
  - Display: Average time from threat to detection
  - Target: <15 minutes
  - Benchmark: Industry = 200+ minutes
  - Alert: If >20 minutes

Metric 4: Compliance Status
  - NIST CSF: 5/5 functions implemented ✅
  - PCI-DSS: 12/12 requirements met ✅
  - ISO 27001: 114/114 controls mapped ✅
  - Status: Audit-ready
```

### Operational Dashboard

```
Real-time Metrics:
  - Active Alerts: [Count by severity]
  - Failed Logins (last hour): [Graph]
  - Blocked Connections: [Top sources]
  - VPN Users Online: [Count]
  - S3 API Calls: [Rate]
  - Firewall Rule Hits: [Top rules]
  - Device Compliance: [Percentage]
  - Sentinel Health: [Status]
```

---

## Compliance & Audit Trail

### Change Log (All security changes logged)

**Required Documentation:**
1. What changed (technical details)
2. Who made the change (username)
3. When (timestamp)
4. Why (business justification)
5. Approval (manager authorization)
6. Rollback procedure
7. Testing results

### Audit Trail in Sentinel

```KQL
AuditLog
| where TimeGenerated > ago(30d)
| where Category == "NetworkConfiguration" or "SecurityPolicy"
| project TimeGenerated, InitiatedBy, Activity, Result
| sort by TimeGenerated desc
```

---

## Performance Baseline

**Network Performance Targets:**
- Latency (LAN): <5ms
- Latency (VLAN): <10ms
- VPN throughput: >100 Mbps
- Firewall throughput: >500 Mbps
- Query response (Sentinel): <5 seconds

**Monitoring & Alerting:**
- Latency increase >20%: Alert
- Packet loss >1%: Alert
- VPN disconnections: Log + Alert
- Query timeout: Alert

---

## Disaster Recovery

**RTO (Recovery Time Objective):**
- VLAN 20 (Financial): 1 hour
- VLAN 10 (Staff): 4 hours
- VLAN 30/40 (Non-critical): 24 hours

**RPO (Recovery Point Objective):**
- VLAN 20: 1 hour
- Others: 4 hours

**Backup Verification:**
- Monthly: Full restore drill
- Weekly: Incremental verification
- Quarterly: Disaster recovery exercise

---

## References

- UniFi Networking: https://unifi-network.ui.com/
- Microsoft Sentinel: https://learn.microsoft.com/azure/sentinel/
- WireGuard VPN: https://www.wireguard.com/
- NIST CSF: https://www.nist.gov/cyberframework/
- PCI DSS: https://www.pcisecuritystandards.org/

