<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pizarra Colaborativa XAMPP</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Pizarra Colaborativa en Tiempo Real</h1>
        
        <div class="tools">
            <input type="color" id="colorPicker" value="#000000">
            <input type="range" id="lineWidth" min="1" max="50" value="5">
            <button id="clearBtn">Limpiar Pizarra</button>
        </div>

        <canvas id="drawingCanvas" width="800" height="500"></canvas>
    </div>

    <script src="script.js"></script>
</body>
</html>