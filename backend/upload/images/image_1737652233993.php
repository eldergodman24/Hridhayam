<html>
<head>
    <title>Request for PG Joining</title>
</head>
<body>
    <h1>Request for PG Joining</h1>
    <form id="newTenant" enctype="multipart/form-data" >
        <label for="tenantname">Enter Name:</label>
        <input type="text" id="tenantname" name="tenantname" required><br>

        <label for="tenantphone">Enter Phone Number:</label>
        <input type="number" id="tenantphone" name="tenantphone" required><br>

        <label for="tenantmail">Enter Mail:</label>
        <input type="email" id="tenantmail" name="tenantmail" required><br>

        <label for="tenantdoc">Upload Document:</label>
        <input type="file" id="tenantdoc" name="tenantdoc"><br>

        <button type="submit">Submit Detail</button>
    </form>

    <script>
        document.getElementById('newTenant').addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = new FormData(this);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'savedata.php', true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    document.getElementById('newTenant').innerHTML = xhr.responseText;
                    alert('Data added successfully!');
                } else {
                    alert('Error adding data.');
                }
            };
            xhr.send(formData);
        });
    </script>
</body>
</html>
