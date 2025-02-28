function formHandler() {
    return {
        message: '',
        users: [],
        localUsers: [], // Store newly submitted users locally
        init() {
            this.fetchUsers();
            this.setupValidation();
        },
        setupValidation() {
            let form = document.getElementById("userForm");
            let pristine = new Pristine(form);

            form.addEventListener("submit", (e) => {
                e.preventDefault();

                if (pristine.validate()) {
                    this.submitForm();
                } else {
                    this.message = "❌ Please enter all the fields!";
                }
            });
        },
        async submitForm() {
            let formData = new FormData(document.getElementById("userForm"));
            let newUser = Object.fromEntries(formData.entries());

            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/users', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                });

                if (response.ok) {
                    let createdUser = await response.json();
                    createdUser.id = this.users.length + this.localUsers.length + 1;

                    // Store the user locally
                    this.localUsers.push(createdUser);

                    this.message = "✅ Form submitted successfully!";
                    document.getElementById("userForm").reset();
                    this.renderUsers();
                } else {
                    this.message = "❌ Submission failed!";
                }
            } catch (error) {
                console.error("Error:", error);
                this.message = "❌ Network error!";
            }
        },
        async fetchUsers() {
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/users');
                let data = await response.json();
                this.users = data;
                this.renderUsers();
            } catch (error) {
                this.message = "❌ Failed to load user data!";
                console.error(error);
            }
        },
        renderUsers() {
            let userList = this.$refs.userList;
            userList.innerHTML = ""; // Clear previous data

            let allUsers = [...this.localUsers, ...this.users]; // Merge local and API users
            allUsers.forEach(user => {
                let li = document.createElement("li");
                li.textContent = `${user.name} - ${user.email}`;
                li.classList.add("p-2", "bg-white", "rounded-lg", "shadow", "mb-2");
                userList.appendChild(li);
            });
        }
    };
}

// Initialize Alpine.js
document.addEventListener("alpine:init", () => {
    Alpine.data("formHandler", formHandler);
});

document.addEventListener("DOMContentLoaded", function () {
    Alpine.start();
});
