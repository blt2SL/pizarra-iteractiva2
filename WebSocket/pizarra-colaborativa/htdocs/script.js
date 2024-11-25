class PizarraColaborativa {
    constructor() {
        // Configurar canvas
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar WebSocket
        this.socket = new WebSocket('ws://localhost:8080');

        // Variables de dibujo
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Elementos de interfaz
        this.colorPicker = document.getElementById('colorPicker');
        this.lineWidthInput = document.getElementById('lineWidth');
        this.clearBtn = document.getElementById('clearBtn');

        // Configurar eventos
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    setupEventListeners() {
        // Eventos del mouse
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Evento de limpieza
        this.clearBtn.addEventListener('click', this.clearCanvas.bind(this));
    }

    setupSocketListeners() {
        this.socket.onopen = () => {
            console.log('Conexión WebSocket establecida');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'draw') {
                this.drawFromSocket(data);
            } else if (data.type === 'clear') {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };

        this.socket.onerror = (error) => {
            console.error('Error de WebSocket:', error);
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }

    draw(e) {
        if (!this.isDrawing) return;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.strokeStyle = this.colorPicker.value;
        this.ctx.lineWidth = this.lineWidthInput.value;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Emitir evento de dibujo
        this.socket.send(JSON.stringify({
            type: 'draw',
            x: e.offsetX,
            y: e.offsetY,
            color: this.colorPicker.value,
            lineWidth: this.lineWidthInput.value
        }));

        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }

    drawFromSocket(data) {
        this.ctx.beginPath();
        this.ctx.moveTo(data.x, data.y);
        this.ctx.lineTo(data.x, data.y);
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = data.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.socket.send(JSON.stringify({
            type: 'clear'
        }));
    }
}

// Inicializar pizarra al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    new PizarraColaborativa();
});