class SafeYatraApp {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.userData = {};
        this.locationPermission = null;
        this.currentChat = null;
        this.autoAlertInterval = null;
        this.safetyNewsData = [];
        this.nearbyFacilities = {
            police: [],
            hospitals: [],
            safePlaces: []
        };
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Safe Yatra App...');
        this.bindEvents();
        this.loadSafetyNews();
        this.loadNearbyFacilities();
        this.setupAutoAlert();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Welcome section events
        const registerBtn = document.getElementById('register-btn');
        const authorityBtn = document.getElementById('authority-login-btn');
        
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Register button clicked');
                this.openRegistration();
            });
        }
        
        if (authorityBtn) {
            authorityBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Authority button clicked');
                this.showAuthorityDashboard();
            });
        }
        
        // Registration modal events
        const closeRegBtn = document.getElementById('close-registration');
        const nextStepBtn = document.getElementById('next-step');
        const prevStepBtn = document.getElementById('prev-step');
        const completeBtn = document.getElementById('complete-registration');
        
        if (closeRegBtn) {
            closeRegBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeRegistration();
            });
        }
        
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        }
        
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        }
        
        if (completeBtn) {
            completeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.completeRegistration();
            });
        }
        
        // Location permission events
        const allowLocationBtn = document.getElementById('allow-location');
        const denyLocationBtn = document.getElementById('deny-location');
        const regionSelect = document.getElementById('travel-region');
        
        if (allowLocationBtn) {
            allowLocationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLocationPermission(true);
            });
        }
        
        if (denyLocationBtn) {
            denyLocationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLocationPermission(false);
            });
        }
        
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                this.handleRegionSelection(e.target.value);
            });
        }
        
        // Dashboard tab events
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.getAttribute('data-tab');
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });
        
        // Safety check-in events
        const confirmSafeBtn = document.getElementById('confirm-safe');
        const needHelpBtn = document.getElementById('need-help');
        
        if (confirmSafeBtn) {
            confirmSafeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmSafety();
            });
        }
        
        if (needHelpBtn) {
            needHelpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.requestHelp();
            });
        }
        
        // Emergency events
        const panicBtn = document.getElementById('panic-btn');
        const sosBtn = document.getElementById('sos-btn');
        
        if (panicBtn) {
            panicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerPanicButton();
            });
        }
        
        if (sosBtn) {
            sosBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSOS();
            });
        }
        
        // Chat events
        const sendBtn = document.getElementById('send-message');
        const messageInput = document.getElementById('message-input');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // News filter events
        const categoryFilter = document.getElementById('news-category-filter');
        const severityFilter = document.getElementById('news-severity-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterNews());
        }
        
        if (severityFilter) {
            severityFilter.addEventListener('change', () => this.filterNews());
        }
        
        // Logout events
        const logoutBtn = document.getElementById('logout-btn');
        const authorityLogoutBtn = document.getElementById('authority-logout');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        if (authorityLogoutBtn) {
            authorityLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
        
        console.log('Events bound successfully');
    }

    openRegistration() {
        console.log('Opening registration modal...');
        const modal = document.getElementById('registration-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.currentStep = 1;
            this.updateProgressIndicator();
            this.updateStepDisplay();
            this.updateButtons();
            console.log('Registration modal opened');
        } else {
            console.error('Registration modal not found');
        }
    }

    closeRegistration() {
        const modal = document.getElementById('registration-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgressIndicator();
                this.updateButtons();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgressIndicator();
            this.updateButtons();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                this.showNotification('Please fill in all required fields', 'error');
                return false;
            }
        }
        
        // Special validation for step 2 (location/region)
        if (this.currentStep === 2) {
            if (this.locationPermission === null) {
                this.showNotification('Please allow location access or select a travel region', 'error');
                return false;
            }
            if (this.locationPermission === false && !document.getElementById('travel-region').value) {
                this.showNotification('Please select your travel region', 'error');
                return false;
            }
        }
        
        return true;
    }

    updateStepDisplay() {
        document.querySelectorAll('.registration-step').forEach(step => {
            step.classList.remove('active');
        });
        const currentStep = document.getElementById(`step-${this.currentStep}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    updateProgressIndicator() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    updateButtons() {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const completeBtn = document.getElementById('complete-registration');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        if (nextBtn && completeBtn) {
            if (this.currentStep === this.maxSteps) {
                nextBtn.classList.add('hidden');
                completeBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                completeBtn.classList.add('hidden');
            }
        }
    }

    handleLocationPermission(allowed) {
        this.locationPermission = allowed;
        
        if (allowed) {
            this.requestGeolocation();
            const regionInput = document.getElementById('region-input');
            if (regionInput) {
                regionInput.classList.add('hidden');
            }
        } else {
            const regionInput = document.getElementById('region-input');
            if (regionInput) {
                regionInput.classList.remove('hidden');
            }
        }
    }

    requestGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userData.location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.showNotification('Location access granted successfully', 'success');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showNotification('Unable to access location. Please select region manually.', 'warning');
                    this.handleLocationPermission(false);
                }
            );
        }
    }

    handleRegionSelection(region) {
        if (region) {
            this.userData.region = region;
            this.loadRegionSafetyInfo(region);
            const regionInfo = document.getElementById('region-safety-info');
            if (regionInfo) {
                regionInfo.classList.remove('hidden');
            }
        }
    }

    loadRegionSafetyInfo(region) {
        // Simulate loading weather and safety info
        setTimeout(() => {
            const weatherInfo = this.getWeatherInfo(region);
            const safetyAlerts = this.getSafetyAlerts(region);
            
            const weatherElement = document.getElementById('weather-info');
            const alertsElement = document.getElementById('safety-alerts');
            
            if (weatherElement) {
                weatherElement.innerHTML = weatherInfo;
            }
            if (alertsElement) {
                alertsElement.innerHTML = safetyAlerts;
            }
        }, 500);
    }

    getWeatherInfo(region) {
        const weatherData = {
            'Delhi NCR': '🌤️ Partly cloudy, 28°C<br>Humidity: 65%<br>Air Quality: Moderate',
            'Mumbai': '🌧️ Light rain, 26°C<br>Humidity: 80%<br>Air Quality: Good',
            'Bangalore': '⛅ Cloudy, 24°C<br>Humidity: 70%<br>Air Quality: Good',
            'Chennai': '☀️ Sunny, 32°C<br>Humidity: 75%<br>Air Quality: Moderate'
        };
        return weatherData[region] || '☀️ Pleasant weather, 25°C<br>Humidity: 60%<br>Air Quality: Good';
    }

    getSafetyAlerts(region) {
        const alertsData = {
            'Delhi NCR': '⚠️ High security at metro stations<br>🚧 Traffic diversions on MG Road<br>🏥 Medical camps available',
            'Mumbai': '🌊 High tide warning at beaches<br>🚂 Local train delays expected<br>⛑️ Monsoon safety advisory',
            'Bangalore': '🚦 Heavy traffic on Outer Ring Road<br>🌡️ Heat wave advisory<br>💧 Stay hydrated'
        };
        return alertsData[region] || '✅ No major alerts<br>🛡️ Normal security levels<br>📱 Emergency services active';
    }

    completeRegistration() {
        if (this.validateCurrentStep()) {
            this.collectUserData();
            this.generateTouristId();
            this.closeRegistration();
            this.showTouristDashboard();
            this.showNotification('Registration completed successfully!', 'success');
        }
    }

    collectUserData() {
        this.userData = {
            ...this.userData,
            fullName: this.getInputValue('full-name'),
            email: this.getInputValue('email'),
            phone: this.getInputValue('phone'),
            nationality: this.getInputValue('nationality'),
            travelPurpose: this.getInputValue('travel-purpose'),
            stayDuration: this.getInputValue('stay-duration'),
            bloodGroup: this.getInputValue('blood-group'),
            emergencyContactName: this.getInputValue('emergency-contact-name'),
            emergencyContactPhone: this.getInputValue('emergency-contact-phone'),
            medicalConditions: this.getInputValue('medical-conditions'),
            allergies: this.getInputValue('allergies'),
            medications: this.getInputValue('medications'),
            idType: this.getInputValue('id-type'),
            idNumber: this.getInputValue('id-number'),
            registrationTime: new Date().toISOString()
        };
    }

    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    generateTouristId() {
        this.userData.touristId = 'TOUR-' + Math.floor(Math.random() * 9000 + 1000);
    }

    showTouristDashboard() {
        const welcomeSection = document.getElementById('welcome-section');
        const dashboardSection = document.getElementById('tourist-dashboard');
        
        if (welcomeSection) welcomeSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        // Update dashboard info
        const userName = document.getElementById('dashboard-user-name');
        const userId = document.getElementById('dashboard-user-id');
        
        if (userName) userName.textContent = this.userData.fullName || 'Tourist';
        if (userId) userId.textContent = `ID: ${this.userData.touristId}`;
        
        // Update emergency profile
        const bloodGroup = document.getElementById('emergency-blood-group');
        const emergencyContact = document.getElementById('emergency-contact');
        const medicalInfo = document.getElementById('emergency-medical');
        
        if (bloodGroup) bloodGroup.textContent = this.userData.bloodGroup || '-';
        if (emergencyContact) {
            emergencyContact.textContent = this.userData.emergencyContactName ? 
                `${this.userData.emergencyContactName} (${this.userData.emergencyContactPhone})` : '-';
        }
        if (medicalInfo) {
            medicalInfo.textContent = this.userData.medicalConditions || 'None reported';
        }
        
        this.loadDashboardData();
        this.startAutoAlert();
    }

    showAuthorityDashboard() {
        console.log('Showing authority dashboard...');
        const welcomeSection = document.getElementById('welcome-section');
        const authoritySection = document.getElementById('authority-dashboard');
        
        if (welcomeSection) welcomeSection.classList.add('hidden');
        if (authoritySection) authoritySection.classList.remove('hidden');
        
        this.loadAuthorityData();
    }

    loadDashboardData() {
        this.loadNearbyFacilities();
        this.loadPoliceStations();
        this.loadSafetyNews();
    }

    loadNearbyFacilities() {
        const policeStations = [
            {name: "Central Police Station", address: "MG Road, Delhi", phone: "+91-11-2334-5678", distance: "0.5 km"},
            {name: "Tourist Police Booth", address: "India Gate, Delhi", phone: "+91-11-2334-9876", distance: "1.2 km"},
            {name: "Cyber Crime Police", address: "CP Metro, Delhi", phone: "+91-11-2334-1111", distance: "2.1 km"}
        ];

        const hospitals = [
            {name: "AIIMS Emergency", address: "Ansari Nagar, Delhi", phone: "+91-11-2658-8500", distance: "1.8 km"},
            {name: "Max Hospital", address: "Saket, Delhi", phone: "+91-11-2651-5050", distance: "3.2 km"},
            {name: "Apollo Hospital", address: "Mathura Road, Delhi", phone: "+91-11-2692-5858", distance: "4.1 km"}
        ];

        const safePlaces = [
            {name: "US Embassy", address: "Chanakyapuri, Delhi", phone: "+91-11-2419-8000", distance: "2.5 km"},
            {name: "Tourist Help Center", address: "Janpath, Delhi", phone: "+91-11-2332-0005", distance: "0.8 km"},
            {name: "Railway Police Station", address: "New Delhi Station", phone: "+91-11-2340-3456", distance: "1.5 km"}
        ];

        this.renderFacilities('police-facilities', policeStations);
        this.renderFacilities('hospital-facilities', hospitals);
        this.renderFacilities('safe-facilities', safePlaces);
    }

    renderFacilities(containerId, facilities) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = facilities.map(facility => `
            <div class="facility-card">
                <div class="facility-header">
                    <div class="facility-info">
                        <h5>${facility.name}</h5>
                        <div class="address">${facility.address}</div>
                        <div class="distance">${facility.distance}</div>
                    </div>
                </div>
                <div class="facility-actions">
                    <a href="tel:${facility.phone}" class="btn btn--primary btn--sm">
                        <i class="fas fa-phone"></i>
                        Call
                    </a>
                    <button class="btn btn--outline btn--sm" onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(facility.address)}', '_blank')">
                        <i class="fas fa-directions"></i>
                        Directions
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadPoliceStations() {
        const stations = [
            {id: "ps1", name: "Central Police Station", status: "online", responseTime: "< 5 mins"},
            {id: "ps2", name: "Tourist Police Booth", status: "online", responseTime: "< 3 mins"},
            {id: "ps3", name: "Cyber Crime Police", status: "offline", responseTime: "N/A"}
        ];

        const quickMessages = [
            "I need immediate help",
            "Lost passport/documents", 
            "Reporting suspicious activity",
            "Need directions to safe location",
            "Medical emergency assistance"
        ];

        this.renderPoliceStations(stations);
        this.renderQuickMessages(quickMessages);
    }

    renderPoliceStations(stations) {
        const container = document.getElementById('station-list');
        if (!container) return;

        container.innerHTML = stations.map(station => `
            <div class="station-item" data-station-id="${station.id}" onclick="app.selectPoliceStation('${station.id}', '${station.name}', '${station.status}')">
                <div class="station-info">
                    <div class="station-status ${station.status}"></div>
                    <div class="station-name">${station.name}</div>
                </div>
                <div class="station-response">${station.responseTime}</div>
            </div>
        `).join('');
    }

    renderQuickMessages(messages) {
        const container = document.getElementById('quick-messages');
        if (!container) return;

        container.innerHTML = messages.map(message => `
            <button class="quick-message-btn" onclick="app.sendQuickMessage('${message}')">
                ${message}
            </button>
        `).join('');
    }

    selectPoliceStation(stationId, stationName, status) {
        this.currentChat = {id: stationId, name: stationName, status: status};
        
        // Update UI
        document.querySelectorAll('.station-item').forEach(item => {
            item.classList.remove('active');
        });
        const selectedStation = document.querySelector(`[data-station-id="${stationId}"]`);
        if (selectedStation) {
            selectedStation.classList.add('active');
        }
        
        // Update chat header
        const chatHeader = document.getElementById('chat-header');
        if (chatHeader) {
            chatHeader.innerHTML = `
                <div class="chat-info">
                    <i class="fas fa-shield-alt"></i>
                    <div>
                        <strong>${stationName}</strong>
                        <span>Status: ${status}</span>
                    </div>
                </div>
            `;
        }
        
        // Show chat interface
        const chatMessages = document.getElementById('chat-messages');
        const chatInputContainer = document.getElementById('chat-input-container');
        
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message received">
                    <div>Hello! This is ${stationName}. How can we assist you today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
        }
        
        if (chatInputContainer) {
            chatInputContainer.classList.remove('hidden');
        }
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (message && this.currentChat) {
            this.addMessageToChat(message, 'sent');
            input.value = '';
            
            // Simulate response
            setTimeout(() => {
                const responses = [
                    "We've received your message and are processing it.",
                    "Our team is on the way to assist you.",
                    "Thank you for reaching out. Stay safe.",
                    "We'll contact you shortly with more information.",
                    "Your safety is our priority. Help is coming."
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                this.addMessageToChat(response, 'received');
            }, 1000 + Math.random() * 2000);
        }
    }

    sendQuickMessage(message) {
        if (this.currentChat) {
            this.addMessageToChat(message, 'sent');
            
            setTimeout(() => {
                this.addMessageToChat("We understand your situation. Our team is responding immediately.", 'received');
            }, 1000);
        } else {
            this.showNotification('Please select a police station first', 'warning');
        }
    }

    addMessageToChat(message, type) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `
            <div>${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    loadSafetyNews() {
        this.safetyNewsData = [
            {
                id: "news1",
                category: "Security",
                severity: "high", 
                title: "Increased Security at Tourist Sites",
                content: "Enhanced security measures implemented at major tourist locations due to festival season.",
                timestamp: "2025-09-14T10:30:00Z",
                source: "Delhi Police",
                region: "Delhi NCR"
            },
            {
                id: "news2",
                category: "Weather", 
                severity: "medium",
                title: "Monsoon Alert",
                content: "Heavy rainfall expected in Delhi NCR. Avoid low-lying areas and use public transport.",
                timestamp: "2025-09-14T08:15:00Z", 
                source: "IMD",
                region: "Delhi NCR"
            },
            {
                id: "news3",
                category: "Health",
                severity: "low",
                title: "Air Quality Advisory", 
                content: "Air quality moderate. People with respiratory issues should take precautions.",
                timestamp: "2025-09-14T06:00:00Z",
                source: "CPCB", 
                region: "Delhi NCR"
            },
            {
                id: "news4",
                category: "Travel",
                severity: "medium",
                title: "Metro Service Update", 
                content: "Blue Line metro services running with 10-minute delays due to technical maintenance.",
                timestamp: "2025-09-14T07:45:00Z",
                source: "Delhi Metro", 
                region: "Delhi NCR"
            }
        ];
        
        this.renderSafetyNews();
    }

    renderSafetyNews(filteredData = null) {
        const newsData = filteredData || this.safetyNewsData;
        const container = document.getElementById('news-list');
        if (!container) return;

        container.innerHTML = newsData.map(news => `
            <div class="news-item">
                <div class="news-header-row">
                    <div class="news-category ${news.category}">${news.category}</div>
                    <div class="severity-badge ${news.severity}">${news.severity}</div>
                </div>
                <h4 class="news-title">${news.title}</h4>
                <p class="news-content">${news.content}</p>
                <div class="news-meta">
                    <span class="news-source">Source: ${news.source}</span>
                    <span class="news-time">${this.formatTimeAgo(news.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    filterNews() {
        const categoryFilter = document.getElementById('news-category-filter');
        const severityFilter = document.getElementById('news-severity-filter');
        
        if (!categoryFilter || !severityFilter) return;
        
        const categoryValue = categoryFilter.value;
        const severityValue = severityFilter.value;
        
        let filteredNews = this.safetyNewsData;
        
        if (categoryValue !== 'all') {
            filteredNews = filteredNews.filter(news => news.category === categoryValue);
        }
        
        if (severityValue !== 'all') {
            filteredNews = filteredNews.filter(news => news.severity === severityValue);
        }
        
        this.renderSafetyNews(filteredNews);
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} mins ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} hours ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} days ago`;
        }
    }

    setupAutoAlert() {
        // Set up automatic safety check-ins every 10 minutes
        this.autoAlertInterval = setInterval(() => {
            const touristDashboard = document.getElementById('tourist-dashboard');
            if (touristDashboard && !touristDashboard.classList.contains('hidden')) {
                this.triggerSafetyCheckIn();
            }
        }, 10 * 60 * 1000); // 10 minutes
    }

    startAutoAlert() {
        // Start immediately and then every 10 minutes
        setTimeout(() => {
            this.triggerSafetyCheckIn();
        }, 5000); // First check-in after 5 seconds for demo
    }

    triggerSafetyCheckIn() {
        const modal = document.getElementById('safety-checkin-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.startCountdown();
        }
    }

    startCountdown() {
        let timeLeft = 5 * 60; // 5 minutes in seconds
        const countdownElement = document.getElementById('countdown');
        
        const countdownInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (countdownElement) {
                countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                this.escalateAlert();
            }
        }, 1000);
        
        // Store interval to clear it if user responds
        this.countdownInterval = countdownInterval;
    }

    confirmSafety() {
        this.clearCountdown();
        const modal = document.getElementById('safety-checkin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.showNotification('Safety confirmed. Thank you!', 'success');
        this.logSafetyResponse('safe');
    }

    requestHelp() {
        this.clearCountdown();
        const modal = document.getElementById('safety-checkin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.triggerEmergencyResponse();
    }

    escalateAlert() {
        const modal = document.getElementById('safety-checkin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.triggerEmergencyResponse();
        this.showNotification('Emergency alert sent to authorities!', 'error');
    }

    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    triggerEmergencyResponse() {
        const emergencyData = {
            touristId: this.userData.touristId,
            location: this.userData.location || this.userData.region,
            timestamp: new Date().toISOString(),
            type: 'emergency',
            bloodGroup: this.userData.bloodGroup,
            emergencyContact: this.userData.emergencyContactPhone,
            medicalConditions: this.userData.medicalConditions
        };
        
        console.log('Emergency Response Triggered:', emergencyData);
        this.showNotification('Emergency services have been notified!', 'error');
        this.logSafetyResponse('emergency');
    }

    triggerPanicButton() {
        if (confirm('This will send an immediate emergency alert to authorities. Continue?')) {
            this.triggerEmergencyResponse();
        }
    }

    triggerSOS() {
        window.open('tel:100'); // Call police
    }

    logSafetyResponse(type) {
        // This would typically send data to a server
        console.log('Safety Response Logged:', {
            touristId: this.userData.touristId,
            responseType: type,
            timestamp: new Date().toISOString()
        });
    }

    loadAuthorityData() {
        this.loadTouristMonitoring();
        this.loadEmergencyAlerts();
        this.loadDeviceStatus();
        this.loadChatSessions();
    }

    loadTouristMonitoring() {
        const tourists = [
            {id: 'TOUR-7834', name: 'John Smith', status: 'Safe', lastCheckIn: '2 mins ago', location: 'India Gate'},
            {id: 'TOUR-9156', name: 'Emma Johnson', status: 'Alert', lastCheckIn: '15 mins ago', location: 'Red Fort'},
            {id: 'TOUR-3421', name: 'Michael Brown', status: 'Safe', lastCheckIn: '1 min ago', location: 'Connaught Place'},
            {id: 'TOUR-5678', name: 'Sarah Davis', status: 'Emergency', lastCheckIn: '5 mins ago', location: 'Karol Bagh'}
        ];

        const container = document.getElementById('tourist-monitoring-list');
        if (!container) return;

        container.innerHTML = tourists.map(tourist => `
            <div class="tourist-item">
                <div class="tourist-info">
                    <div class="tourist-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="tourist-details">
                        <div class="tourist-name">${tourist.name} (${tourist.id})</div>
                        <div class="tourist-status">Last seen: ${tourist.lastCheckIn} - ${tourist.location}</div>
                    </div>
                </div>
                <div class="status status--${tourist.status.toLowerCase() === 'safe' ? 'success' : tourist.status.toLowerCase() === 'alert' ? 'warning' : 'error'}">
                    ${tourist.status}
                </div>
            </div>
        `).join('');
    }

    loadEmergencyAlerts() {
        const alerts = [
            {id: 'ALERT-001', tourist: 'Sarah Davis (TOUR-5678)', type: 'No Response', time: '5 mins ago', priority: 'high'},
            {id: 'ALERT-002', tourist: 'Emma Johnson (TOUR-9156)', type: 'Low Battery', time: '15 mins ago', priority: 'medium'},
            {id: 'ALERT-003', tourist: 'Alex Wilson (TOUR-4567)', type: 'Geo-fence Breach', time: '1 hour ago', priority: 'high'}
        ];

        const container = document.getElementById('emergency-alert-list');
        if (!container) return;

        container.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-info">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-details">
                        <div class="alert-title">${alert.type} - ${alert.tourist}</div>
                        <div class="alert-time">${alert.time}</div>
                    </div>
                </div>
                <div class="status status--${alert.priority === 'high' ? 'error' : 'warning'}">
                    ${alert.priority.toUpperCase()}
                </div>
            </div>
        `).join('');
    }

    loadDeviceStatus() {
        const devices = [
            {id: "TOUR-7834", name: "John Smith", battery: 85, device: "iPhone 14", browser: "Safari", lastSeen: "2 mins ago"},
            {id: "TOUR-9156", name: "Emma Johnson", battery: 23, device: "Samsung Galaxy", browser: "Chrome", lastSeen: "5 mins ago"},
            {id: "TOUR-3421", name: "Michael Brown", battery: 67, device: "OnePlus 11", browser: "Chrome", lastSeen: "1 min ago"},
            {id: "TOUR-5678", name: "Sarah Davis", battery: 12, device: "iPhone 13", browser: "Safari", lastSeen: "15 mins ago"}
        ];

        const container = document.getElementById('device-status-list');
        if (!container) return;

        container.innerHTML = devices.map(device => `
            <div class="device-item">
                <div class="device-info">
                    <div class="device-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <div class="device-details">
                        <div class="device-name">${device.name} (${device.id})</div>
                        <div class="device-status">${device.device} - ${device.browser} - ${device.lastSeen}</div>
                    </div>
                </div>
                <div class="battery-status">
                    <div class="battery-bar">
                        <div class="battery-fill ${device.battery > 50 ? 'high' : device.battery > 25 ? 'medium' : 'low'}" 
                             style="--battery-level: ${device.battery}%; width: ${device.battery}%"></div>
                    </div>
                    <span class="battery-text">${device.battery}%</span>
                </div>
            </div>
        `).join('');
    }

    loadChatSessions() {
        const sessions = [
            {id: 'CHAT-001', user: 'John Smith', station: 'Central Police', status: 'Active', lastMessage: '2 mins ago'},
            {id: 'CHAT-002', user: 'Emma Johnson', station: 'Tourist Police', status: 'Pending', lastMessage: '5 mins ago'},
            {id: 'CHAT-003', user: 'Michael Brown', station: 'Cyber Crime', status: 'Resolved', lastMessage: '1 hour ago'}
        ];

        const container = document.getElementById('active-chat-list');
        if (!container) return;

        container.innerHTML = sessions.map(session => `
            <div class="chat-session">
                <div class="chat-info">
                    <div class="chat-avatar">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="chat-details">
                        <div class="chat-user">${session.user} ↔ ${session.station}</div>
                        <div class="chat-status">Last message: ${session.lastMessage}</div>
                    </div>
                </div>
                <div class="status status--${session.status.toLowerCase() === 'active' ? 'success' : session.status.toLowerCase() === 'pending' ? 'warning' : 'info'}">
                    ${session.status}
                </div>
            </div>
        `).join('');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Load data if needed
        const authorityDashboard = document.getElementById('authority-dashboard');
        if (tabName === 'device-monitoring' && authorityDashboard && !authorityDashboard.classList.contains('hidden')) {
            this.loadDeviceStatus();
        }
    }

    logout() {
        // Clear intervals
        if (this.autoAlertInterval) {
            clearInterval(this.autoAlertInterval);
        }
        this.clearCountdown();
        
        // Reset state
        this.userData = {};
        this.currentChat = null;
        this.locationPermission = null;
        
        // Show welcome section
        const welcomeSection = document.getElementById('welcome-section');
        const touristDashboard = document.getElementById('tourist-dashboard');
        const authorityDashboard = document.getElementById('authority-dashboard');
        
        if (welcomeSection) welcomeSection.classList.remove('hidden');
        if (touristDashboard) touristDashboard.classList.add('hidden');
        if (authorityDashboard) authorityDashboard.classList.add('hidden');
        
        this.showNotification('Logged out successfully', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles if not exist
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: white;
                    z-index: 3000;
                    animation: slideIn 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    max-width: 400px;
                }
                .notification--success { background: var(--color-success); }
                .notification--error { background: var(--color-error); }
                .notification--warning { background: var(--color-warning); }
                .notification--info { background: var(--color-info); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application
const app = new SafeYatraApp();

// Make app globally available for onclick handlers
window.app = app;