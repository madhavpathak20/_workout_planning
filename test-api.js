// Test script to verify API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:7700/api';

async function testAPI() {
    console.log('Testing API endpoints...\n');

    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const response = await axios.get(`${BASE_URL.replace('/api', '')}`);
        console.log('✅ Server is running:', response.data);
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        return;
    }

    // Test 2: Test registration
    console.log('\n2. Testing user registration...');
    try {
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('✅ Registration successful:', registerResponse.data.message);
    } catch (error) {
        if (error.response?.status === 409) {
            console.log('⚠️  User already exists (this is expected for testing)');
        } else {
            console.log('❌ Registration failed:', error.response?.data?.message || error.message);
        }
    }

    // Test 3: Test login
    console.log('\n3. Testing user login...');
    try {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'testuser',
            password: 'password123'
        });
        console.log('✅ Login successful:', loginResponse.data.message);
        
        // Store the cookie for subsequent requests
        const cookies = loginResponse.headers['set-cookie'];
        const authCookie = cookies ? cookies[0] : null;
        
        if (authCookie) {
            console.log('✅ Authentication cookie received');
            
            // Test 4: Test routine creation
            console.log('\n4. Testing routine creation...');
            try {
                const routineResponse = await axios.post(`${BASE_URL}/routines`, {
                    name: 'Test Routine',
                    workout_type: 'Strength Training',
                    body_part: 'Chest',
                    link: 'https://example.com/workout',
                    author: loginResponse.data.details._id
                }, {
                    headers: {
                        Cookie: authCookie
                    }
                });
                console.log('✅ Routine creation successful:', routineResponse.data.message);
                
                // Test 5: Test meal creation
                console.log('\n5. Testing meal creation...');
                try {
                    const mealResponse = await axios.post(`${BASE_URL}/meals`, {
                        name: 'Test Meal',
                        description: 'A test meal for testing purposes',
                        recipe: 'https://example.com/recipe',
                        time: 30,
                        category: 'Main Course',
                        author: loginResponse.data.details._id
                    }, {
                        headers: {
                            Cookie: authCookie
                        }
                    });
                    console.log('✅ Meal creation successful:', mealResponse.data.message);
                    
                    // Test 6: Test entry creation
                    console.log('\n6. Testing entry creation...');
                    try {
                        const entryResponse = await axios.post(`${BASE_URL}/entries`, {
                            date: new Date().toISOString().split('T')[0],
                            meals: [mealResponse.data.meal._id],
                            routines: [routineResponse.data.routine._id],
                            author: loginResponse.data.details._id
                        }, {
                            headers: {
                                Cookie: authCookie
                            }
                        });
                        console.log('✅ Entry creation successful:', entryResponse.data.message);
                        
                    } catch (error) {
                        console.log('❌ Entry creation failed:', error.response?.data?.message || error.message);
                    }
                    
                } catch (error) {
                    console.log('❌ Meal creation failed:', error.response?.data?.message || error.message);
                }
                
            } catch (error) {
                console.log('❌ Routine creation failed:', error.response?.data?.message || error.message);
            }
            
        } else {
            console.log('❌ No authentication cookie received');
        }
        
    } catch (error) {
        console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API testing completed!');
}

// Run the test
testAPI().catch(console.error); 