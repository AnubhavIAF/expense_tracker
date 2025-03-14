document.addEventListener("DOMContentLoaded", async () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expense-list");
    const dailyExpenseList = document.getElementById("daily-expense-list");
    const weeklyExpenseList = document.getElementById("weekly-expense-list");
    const monthlyExpenseList = document.getElementById("monthly-expense-list");
    const buyMembershipBtn = document.getElementById("buyMembershipBtn");
    const premiumText = document.getElementById("premiumText");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const paginationContainer = document.getElementById('pagination');
    const dailyPaginationContainer = document.getElementById('daily-pagination');
    const weeklyPaginationContainer = document.getElementById('weekly-pagination');
    const monthlyPaginationContainer = document.getElementById('monthly-pagination');

    let currentPage = 1; // Track current page for regular expenses
    let currentDailyPage = 1; // Track current page for daily expenses
    let currentWeeklyPage = 1; // Track current page for weekly expenses
    let currentMonthlyPage = 1; // Track current page for monthly expenses
    let limit = getExpensesPerPage(); // Expenses per page

    // ✅ Debugging: Check if elements are being selected
    console.log("Expense Form:", expenseForm);
    console.log("Expense List:", expenseList);
    console.log("Daily Expense List:", dailyExpenseList);
    console.log("Weekly Expense List:", weeklyExpenseList);
    console.log("Monthly Expense List:", monthlyExpenseList);
    console.log("Buy Membership Button:", buyMembershipBtn);
    console.log("Premium Text:", premiumText);
    console.log("Leaderboard Button:", leaderboardBtn);

    // Function to determine the number of expenses per page based on screen width
    function getExpensesPerPage() {
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let limitValue;

        if (screenWidth <= 768) {
            limitValue = 5;
        } else if (screenWidth <= 1200) {
            limitValue = 10;
        } else {
            limitValue = 16;
        }

        console.log("Screen width:", screenWidth, "Expenses per page:", limitValue);
        return limitValue;
    }

    window.addEventListener('resize', () => {
        console.log('Window was resized');
        limit = getExpensesPerPage(); // Update limit
        currentPage = 1; // Reset to first page
        currentDailyPage = 1;
        currentWeeklyPage = 1;
        currentMonthlyPage = 1;
        fetchAllExpenses(); // Reload all expenses with new settings
    });

    // ✅ Function to fetch and display expenses with pagination
    async function fetchExpenses(page) {
        try {
            limit = getExpensesPerPage();
            console.log('Fetching expenses for page:', page, 'with limit:', limit);

            const response = await fetch(`/expense/getAll?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expenses = data.expenses;
            console.log('Received expenses:', expenses);

            expenseList.innerHTML = ""; // Clear existing list
            if (expenses.length === 0) {
                expenseList.innerHTML = "<li>No expenses found.</li>";
            } else {
                expenses.forEach(exp => {
                    addExpenseToList(exp, 'expense-list'); // Pass the target table ID
                });
            }

            console.log('Calling displayPagination with:', currentPage, data.totalPages, 'fetchExpenses', paginationContainer); // ADD THIS

            displayPagination(currentPage, data.totalPages, 'fetchExpenses', paginationContainer);
        } catch (error) {
            console.error("❌❌❌ Error fetching expenses:", error);
            expenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
        }
    }

    // ✅ Function to fetch and display daily expenses
    async function fetchDailyExpenses(page) {
        try {
            limit = getExpensesPerPage();
            console.log('Fetching daily expenses for page:', page, 'with limit:', limit);

            const response = await fetch(`/expense/daily?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expenses = data.expenses;
            console.log('Received daily expenses:', expenses);

            dailyExpenseList.innerHTML = ""; // Clear existing list
            if (expenses.length === 0) {
                dailyExpenseList.innerHTML = "<li>No expenses found.</li>";
            } else {
                expenses.forEach(exp => {
                    addExpenseToList(exp, 'daily-expense-list'); // Pass the target table ID
                });
            }

            console.log('Calling displayPagination with:', currentDailyPage, data.totalPages, 'fetchDailyExpenses', dailyPaginationContainer);

            displayPagination(currentDailyPage, data.totalPages, 'fetchDailyExpenses', dailyPaginationContainer);
        } catch (error) {
            console.error("❌❌❌ Error fetching daily expenses:", error);
            dailyExpenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
        }
    }

    // ✅ Function to fetch and display weekly expenses
    async function fetchWeeklyExpenses(page) {
        try {
            limit = getExpensesPerPage();
            console.log('Fetching weekly expenses for page:', page, 'with limit:', limit);

            const response = await fetch(`/expense/weekly?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expenses = data.expenses;
            console.log('Received weekly expenses:', expenses);

            weeklyExpenseList.innerHTML = ""; // Clear existing list
            if (expenses.length === 0) {
                weeklyExpenseList.innerHTML = "<li>No expenses found.</li>";
            } else {
                expenses.forEach(exp => {
                    addExpenseToList(exp, 'weekly-expense-list'); // Pass the target table ID
                });
            }

            console.log('Calling displayPagination with:', currentWeeklyPage, data.totalPages, 'fetchWeeklyExpenses', weeklyPaginationContainer);

            displayPagination(currentWeeklyPage, data.totalPages, 'fetchWeeklyExpenses', weeklyPaginationContainer);
        } catch (error) {
            console.error("❌❌❌ Error fetching weekly expenses:", error);
            weeklyExpenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
        }
    }

    // ✅ Function to fetch and display monthly expenses
    async function fetchMonthlyExpenses(page) {
        try {
            limit = getExpensesPerPage();
            console.log('Fetching monthly expenses for page:', page, 'with limit:', limit);

            const response = await fetch(`/expense/monthly?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expenses = data.expenses;
            console.log('Received monthly expenses:', expenses);

            monthlyExpenseList.innerHTML = ""; // Clear existing list
            if (expenses.length === 0) {
                monthlyExpenseList.innerHTML = "<li>No expenses found.</li>";
            } else {
                expenses.forEach(exp => {
                    addExpenseToList(exp, 'monthly-expense-list'); // Pass the target table ID
                });
            }

            console.log('Calling displayPagination with:', currentMonthlyPage, data.totalPages, 'fetchMonthlyExpenses', monthlyPaginationContainer);

            displayPagination(currentMonthlyPage, data.totalPages, 'fetchMonthlyExpenses', monthlyPaginationContainer);
        } catch (error) {
            console.error("❌❌❌ Error fetching monthly expenses:", error);
            monthlyExpenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
        }
    }

    // ✅ Function to fetch all expenses data
    async function fetchAllExpenses() {
        await fetchExpenses(currentPage);
        await fetchDailyExpenses(currentDailyPage);
        await fetchWeeklyExpenses(currentWeeklyPage);
        await fetchMonthlyExpenses(currentMonthlyPage);
    }


    // ✅ Initial expenses fetch
    fetchAllExpenses();

    // ✅ Function to display pagination controls with limited page numbers
    function displayPagination(currentPage, totalPages, fetchFunction, paginationContainer) {

        console.log('displayPagination called with:', currentPage, totalPages, fetchFunction, paginationContainer);
        paginationContainer.innerHTML = ''; // Clear existing buttons
    
        if (totalPages <= 1) return; // No pagination needed if only 1 page
    
        // **Previous Button** (only show if not on first page)
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                console.log("Prev button clicked", fetchFunction, currentPage - 1)
                updatePage(fetchFunction, currentPage - 1);
            });
            paginationContainer.appendChild(prevButton);
        }
    
        // **First Page Always**
        const firstPage = document.createElement('button');
        firstPage.textContent = '1';
        firstPage.addEventListener('click', () => 
            console.log("First page clicked", fetchFunction, 1),
            updatePage(fetchFunction, 1));
        if (currentPage === 1) firstPage.disabled = true;
        paginationContainer.appendChild(firstPage);
    
        // **Dots Before Current Page**
        if (currentPage > 3) {
            paginationContainer.appendChild(document.createTextNode(" ... "));
        }
    
        // **Previous Page (if applicable)**
        if (currentPage - 1 > 1) {
            const prevPage = document.createElement('button');
            prevPage.textContent = currentPage - 1;
            prevPage.addEventListener('click', () => updatePage(fetchFunction, currentPage - 1));
            paginationContainer.appendChild(prevPage);
        }
    
        // **Current Page**
        if (currentPage !== 1 && currentPage !== totalPages) {
            const currentPageBtn = document.createElement('button');
            currentPageBtn.textContent = currentPage;
            currentPageBtn.disabled = true;
            paginationContainer.appendChild(currentPageBtn);
        }
    
        // **Next Page (if applicable)**
        if (currentPage + 1 < totalPages) {
            const nextPage = document.createElement('button');
            nextPage.textContent = currentPage + 1;
            nextPage.addEventListener('click', () => updatePage(fetchFunction, currentPage + 1));
            paginationContainer.appendChild(nextPage);
        }
    
        // **Dots After Current Page**
        if (currentPage < totalPages - 2) {
            paginationContainer.appendChild(document.createTextNode(" ... "));
        }
    
        // **Last Page Always**
        if (totalPages > 1) {
            const lastPage = document.createElement('button');
            lastPage.textContent = totalPages;
            lastPage.addEventListener('click', () => updatePage(fetchFunction, totalPages));
            if (currentPage === totalPages) lastPage.disabled = true;
            paginationContainer.appendChild(lastPage);
        }
    
        // **Next Button** (only show if not on last page)
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                updatePage(fetchFunction, currentPage + 1);
            });
            paginationContainer.appendChild(nextButton);
        }
    }
    

    function updatePage(fetchFunction, newPage) {
        switch (fetchFunction) {
            case 'fetchExpenses': currentPage = newPage; fetchExpenses(currentPage); break;
            case 'fetchDailyExpenses': currentDailyPage = newPage; fetchDailyExpenses(currentDailyPage); break;
            case 'fetchWeeklyExpenses': currentWeeklyPage = newPage; fetchWeeklyExpenses(currentWeeklyPage); break;
            case 'fetchMonthlyExpenses': currentMonthlyPage = newPage; fetchMonthlyExpenses(currentMonthlyPage); break;
        }
    }
    
    // ✅ Handle delete button clicks (event delegation)
    async function handleDeleteClick(event) {
        if (event.target.classList.contains("delete-btn")) {
            const expenseId = event.target.dataset.id;
            try {
                const response = await fetch(`/expense/delete/${expenseId}`, { method: "DELETE" })

                if (response.ok) {
                    alert("✅ Expense deleted successfully!");
                    fetchAllExpenses(); // Refresh all tables after delete
                } else {
                    const data = await response.json();
                    alert("❌ Error deleting expense: " + data.message);
                }
            } catch (error) {
                console.error("❌ Error deleting expense:", error);
                alert("❌ Error deleting expense: " + error.message);
            }
        }
    }

    expenseList.addEventListener("click", handleDeleteClick);
    dailyExpenseList.addEventListener("click", handleDeleteClick);
    weeklyExpenseList.addEventListener("click", handleDeleteClick);
    monthlyExpenseList.addEventListener("click", handleDeleteClick);

    // ✅ Handle form submission properly
    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // ✅ Prevent default form submission (fixes page refresh)

        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;

        try {
            const response = await fetch("/expense/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, description, category })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (response.status === 201) {
                alert("✅ Expense added successfully!"); // ✅ Provide user feedback
                fetchAllExpenses(); // Refresh all expenses to update pagination

                // Optionally, you could clear the form fields instead of reloading:
                // document.getElementById("amount").value = "";
                // document.getElementById("description").value = "";
                // document.getElementById("category").value = "food"; // Reset to default
            } else {
                alert("❌ Error adding expense: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error adding expense:", error);
            alert("❌ Error adding expense: " + error.message);
        }
    });

    // Function to add expense to list
    function addExpenseToList(exp, tableId) {
        const tableBody = document.getElementById(tableId);
    
        // Ensure the date and time are correctly formatted
        const expenseDate = exp.date ? exp.date : "N/A";
        const expenseTime = exp.time ? exp.time : "N/A";
    
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expenseDate}</td>
            <td>${expenseTime}</td>
            <td>${exp.description}</td>
            <td>${exp.category}</td>
            <td>₹${exp.amount}</td>
            <td><button class="delete-btn" data-id="${exp.id}" data-table="${tableId}">Delete</button></td>
        `;
    
        tableBody.appendChild(row);
    }
    // ✅ Check if button exists
    if (!buyMembershipBtn) {
        console.warn("❌ Buy Membership button not found!");
    }
    if (!leaderboardBtn) {
        console.warn("❌ Leaderboard button not found!");
    }
    console.log("✅ Buy Membership button found!");
    console.log("✅ leaderboard button found!");

    // ✅ Check if user is logged in
    try {
        const res = await fetch("/user/session");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const userId = data.userId;

        if (!userId) {
            alert("Error: User ID not found. Please log in again.");
            window.location.href = "signup.html";
            return;
        }

        // ✅ Fetch user details to check if they are premium
        const userRes = await fetch("/user/details");
        if (!userRes.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const userData = await userRes.json();

        console.log("✅ User Data:", userData); // Add this line
        console.log("✅ isPremium:", userData.isPremium); // Add this line
        console.log("✅ Type of isPremium", typeof userData.isPremium)

        if (userData.isPremium === 1 || userData.isPremium === true) {
            buyMembershipBtn.style.display = "none";
            premiumText.style.display = "block";
            if (leaderboardBtn) { // Check if leaderboardBtn exists before setting style
                leaderboardBtn.style.display = "block";
            } else {
                console.warn("⚠️ Leaderboard button not found!");
            }
        } else {
            buyMembershipBtn.style.display = "block";
            premiumText.style.display = "none";
            if (leaderboardBtn) { // Check if leaderboardBtn exists before setting style
                leaderboardBtn.style.display = "none";
            } else {
                console.warn("⚠️ Leaderboard button not found!");
            }
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        alert("❌ Failed to check user status. Please try again.");
        return;
    }
    // ✅ Handle "Buy Membership" Button Click
    buyMembershipBtn.addEventListener("click", async () => {
        console.log("✅ Buy Membership button clicked!");

        try {
            const response = await fetch("/purchase/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ Fetch request sent to /purchase/membership");

            const data = await response.json();

            if (!data.orderId) {
                console.error("❌ Failed to create order. Response:", data);
                alert("Error: Unable to create order. Check console.");
                return;
            }

            console.log("✅ Order created successfully!", data);

            const options = {
                key: "rzp_test_cNdwDn00jRSuoN",
                amount: 3000,
                currency: "INR",
                name: "Expense Tracker Premium",
                order_id: data.orderId,
                handler: async function (response) {
                    console.log("✅ Payment successful:", response);
                    await verifyPayment(response, data.orderId);
                },
                prefill: {
                    email: localStorage.getItem("userEmail"),
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("❌ Error in buy membership:", error);
            alert("Something went wrong while processing payment.");
        }
    });

    async function verifyPayment(response, orderId) {
        try {
            console.log("✅ Verifying payment...", response);

            const res = await fetch("/purchase/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            const result = await res.json();
            console.log("✅ Payment verification response:", result);

            if (result.success) {
                alert("🎉 Transaction Successful! You are now a premium member.");
                window.location.reload(); // ✅ Refresh to show updated premium status
            } else {
                alert("❌ Transaction Failed.");
            }
        } catch (error) {
            console.error("❌ Error verifying payment:", error);
            alert("Something went wrong while verifying payment.");
        }
    }

    // ✅ Function to toggle leaderboard visibility and fetch data
    window.toggleLeaderboard = async function() {
        const leaderboardContainer = document.getElementById("leaderboardContainer");
        const leaderboardTable = document.getElementById("leaderboard");

        if (leaderboardContainer.style.display === "none") {
            leaderboardContainer.style.display = "block";

            // Fetch leaderboard data
            try {
                const response = await fetch("/expense/leaderboard");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const leaderboardData = await response.json();

                // Populate the leaderboard table
                leaderboardTable.innerHTML = ""; // Clear existing data
                leaderboardData.forEach((user, index) => {
                    const row = leaderboardTable.insertRow();
                    const rankCell = row.insertCell();
                    const nameCell = row.insertCell();
                    const expenseCell = row.insertCell();

                    rankCell.textContent = index + 1;
                    nameCell.textContent = user.name;
                    expenseCell.textContent = user.total_expense;
                });
            } catch (error) {
                console.error("❌ Error fetching leaderboard:", error);
                alert("❌ Failed to fetch leaderboard data.");
                leaderboardContainer.style.display = "none"; // Hide on error
            }
        } else {
            leaderboardContainer.style.display = "none";
        }
    }
});