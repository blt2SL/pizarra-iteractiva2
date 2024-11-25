<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require dirname(__DIR__) . '/vendor/autoload.php';

class PizarraColaborativa implements MessageComponentInterface {
    protected $clientes;

    public function __construct() {
        $this->clientes = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clientes->attach($conn);
        echo "Nueva conexión: {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $datos = json_decode($msg, true);

        foreach ($this->clientes as $cliente) {
            if ($cliente !== $from) {
                $cliente->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clientes->detach($conn);
        echo "Conexión cerrada: {$conn->resourceId}\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Iniciar servidor WebSocket
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new PizarraColaborativa()
        )
    ),
    8080
);

echo "Servidor WebSocket iniciando en puerto 8080...\n";
$server->run();