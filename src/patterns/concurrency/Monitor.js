const monitorPattern = {
  id: 'monitor',
  name: 'Monitor',
  category: 'concurrency',
  description: 'Encapsula datos compartidos y los procedimientos que operan sobre ellos en un módulo protegido, garantizando que solo un hilo puede ejecutar cualquiera de estos procedimientos a la vez.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <thread>
#include <vector>

// Implementación de un buffer limitado usando el patrón Monitor
class BoundedBuffer {
private:
    const unsigned int capacity;   // Tamaño máximo del buffer
    std::queue<int> buffer;        // Cola que almacena los elementos
    
    // Mecanismos de sincronización
    std::mutex mtx;                // Mutex para proteger el acceso al buffer
    std::condition_variable not_full;    // Condición: buffer no está lleno
    std::condition_variable not_empty;   // Condición: buffer no está vacío

public:
    explicit BoundedBuffer(unsigned int capacity) : capacity(capacity) {}
    
    // Método para añadir un elemento al buffer (usado por productores)
    void put(int item) {
        // Adquirir el lock
        std::unique_lock<std::mutex> lock(mtx);
        
        // Esperar mientras el buffer esté lleno
        not_full.wait(lock, [this] { return buffer.size() < capacity; });
        
        // Añadir el elemento al buffer
        buffer.push(item);
        std::cout << "Productor: elemento " << item << " añadido. Buffer ahora tiene " 
                  << buffer.size() << " elementos." << std::endl;
        
        // Notificar a un consumidor que el buffer ya no está vacío
        not_empty.notify_one();
    }
    
    // Método para obtener un elemento del buffer (usado por consumidores)
    int take() {
        // Adquirir el lock
        std::unique_lock<std::mutex> lock(mtx);
        
        // Esperar mientras el buffer esté vacío
        not_empty.wait(lock, [this] { return !buffer.empty(); });
        
        // Extraer el elemento del buffer
        int item = buffer.front();
        buffer.pop();
        std::cout << "Consumidor: elemento " << item << " extraído. Buffer ahora tiene " 
                  << buffer.size() << " elementos." << std::endl;
        
        // Notificar a un productor que el buffer ya no está lleno
        not_full.notify_one();
        
        return item;
    }
};

// Función para el hilo productor
void producer(BoundedBuffer& buffer, int start, int count) {
    for (int i = 0; i < count; ++i) {
        buffer.put(start + i);
        std::this_thread::sleep_for(std::chrono::milliseconds(100)); // Simular trabajo
    }
}

// Función para el hilo consumidor
void consumer(BoundedBuffer& buffer, int count) {
    for (int i = 0; i < count; ++i) {
        int item = buffer.take();
        std::this_thread::sleep_for(std::chrono::milliseconds(150)); // Simular procesamiento
    }
}

int main() {
    BoundedBuffer buffer(5); // Buffer con capacidad para 5 elementos
    
    // Crear hilos productores y consumidores
    std::vector<std::thread> threads;
    threads.push_back(std::thread(producer, std::ref(buffer), 1, 10));
    threads.push_back(std::thread(producer, std::ref(buffer), 100, 8));
    threads.push_back(std::thread(consumer, std::ref(buffer), 12));
    threads.push_back(std::thread(consumer, std::ref(buffer), 6));
    
    // Esperar a que todos los hilos terminen
    for (auto& t : threads) {
        t.join();
    }
    
    return 0;
}`,
      explanation: [
        { line: 1, text: 'Incluimos las bibliotecas necesarias para sincronización y concurrencia.' },
        { line: 8, text: 'La clase BoundedBuffer es un monitor que encapsula un buffer compartido entre productores y consumidores.' },
        { line: 10, text: 'Atributos privados que representan el estado interno del monitor.' },
        { line: 14, text: 'Los mecanismos de sincronización (mutex y variables de condición) son parte del monitor.' },
        { line: 15, text: 'El mutex protege el acceso concurrente a los datos compartidos.' },
        { line: 16, text: 'Variables de condición para bloquear hilos cuando no pueden proceder.' },
        { line: 21, text: 'El método put añade elementos al buffer y es usado por productores.' },
        { line: 23, text: 'Cada método del monitor debe adquirir el lock al inicio.' },
        { line: 26, text: 'Espera en la variable de condición not_full si el buffer está lleno.' },
        { line: 29, text: 'Modificación segura de los datos compartidos dentro de la sección crítica.' },
        { line: 33, text: 'Notifica a los consumidores que el buffer ya no está vacío.' },
        { line: 37, text: 'El método take extrae elementos del buffer y es usado por consumidores.' },
        { line: 42, text: 'Espera en la variable de condición not_empty si el buffer está vacío.' },
        { line: 52, text: 'Notifica a los productores que el buffer ya no está lleno.' },
        { line: 59, text: 'Función para el hilo productor que añade elementos al buffer.' },
        { line: 67, text: 'Función para el hilo consumidor que extrae elementos del buffer.' },
        { line: 75, text: 'Creamos un buffer compartido con capacidad para 5 elementos.' },
        { line: 78, text: 'Lanzamos varios hilos productores y consumidores que operan concurrentemente.' }
      ]
    },
    
    java: {
      code: `import java.util.LinkedList;
import java.util.Queue;

// Monitor para un buffer limitado en Java
public class BoundedBuffer {
    private final int capacity;
    private final Queue<Integer> buffer;
    
    public BoundedBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new LinkedList<>();
    }
    
    // Método sincronizado para añadir un elemento
    public synchronized void put(int item) throws InterruptedException {
        // Esperar mientras el buffer esté lleno
        while (buffer.size() >= capacity) {
            wait(); // Libera el monitor y bloquea el hilo actual
        }
        
        // Añadir el elemento
        buffer.offer(item);
        System.out.println("Productor: elemento " + item + " añadido. Buffer ahora tiene " 
                          + buffer.size() + " elementos.");
        
        // Notificar a todos los hilos esperando
        notifyAll();
    }
    
    // Método sincronizado para extraer un elemento
    public synchronized int take() throws InterruptedException {
        // Esperar mientras el buffer esté vacío
        while (buffer.isEmpty()) {
            wait(); // Libera el monitor y bloquea el hilo actual
        }
        
        // Extraer el elemento
        int item = buffer.poll();
        System.out.println("Consumidor: elemento " + item + " extraído. Buffer ahora tiene " 
                          + buffer.size() + " elementos.");
        
        // Notificar a todos los hilos esperando
        notifyAll();
        
        return item;
    }
    
    // Clase Productor
    public static class Producer implements Runnable {
        private final BoundedBuffer buffer;
        private final int start;
        private final int count;
        
        public Producer(BoundedBuffer buffer, int start, int count) {
            this.buffer = buffer;
            this.start = start;
            this.count = count;
        }
        
        @Override
        public void run() {
            try {
                for (int i = 0; i < count; i++) {
                    buffer.put(start + i);
                    Thread.sleep(100); // Simular trabajo
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    // Clase Consumidor
    public static class Consumer implements Runnable {
        private final BoundedBuffer buffer;
        private final int count;
        
        public Consumer(BoundedBuffer buffer, int count) {
            this.buffer = buffer;
            this.count = count;
        }
        
        @Override
        public void run() {
            try {
                for (int i = 0; i < count; i++) {
                    int item = buffer.take();
                    Thread.sleep(150); // Simular procesamiento
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    // Método principal para demostración
    public static void main(String[] args) {
        BoundedBuffer buffer = new BoundedBuffer(5);
        
        // Crear y arrancar hilos
        Thread producer1 = new Thread(new Producer(buffer, 1, 10));
        Thread producer2 = new Thread(new Producer(buffer, 100, 8));
        Thread consumer1 = new Thread(new Consumer(buffer, 12));
        Thread consumer2 = new Thread(new Consumer(buffer, 6));
        
        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();
        
        // Esperar a que terminen los hilos
        try {
            producer1.join();
            producer2.join();
            consumer1.join();
            consumer2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}`,
      explanation: [
        { line: 4, text: 'La clase BoundedBuffer implementa un monitor en Java, encapsulando datos y sincronización.' },
        { line: 13, text: 'La palabra clave synchronized hace que el método adquiera el lock intrínseco del objeto.' },
        { line: 15, text: 'Usamos un bucle while para esperar condiciones, evitando despertares espurios.' },
        { line: 16, text: 'El método wait libera el monitor y bloquea el hilo actual hasta ser notificado.' },
        { line: 24, text: 'notifyAll despierta a todos los hilos que están esperando en este monitor.' },
        { line: 28, text: 'Otro método sincronizado que forma parte del monitor.' },
        { line: 45, text: 'Clase interna que implementa un productor como un hilo separado.' },
        { line: 67, text: 'Clase interna que implementa un consumidor como un hilo separado.' },
        { line: 88, text: 'Método principal que crea el monitor y lanza varios hilos para demostrar la concurrencia.' }
      ]
    }
  },
  
  theory: {
    background: 'El patrón Monitor fue propuesto por Tony Hoare en 1974 como un mecanismo de sincronización de alto nivel. Es una abstracción que combina mutexes y variables de condición en una construcción sencilla y potente, facilitando la escritura de código concurrente correcto. Lenguajes como Java implementan el concepto a través de sus bloques synchronized, mientras C++ requiere implementación manual usando mutexes y variables de condición.',
    
    problem: 'La programación concurrente requiere coordinación cuidadosa del acceso a datos compartidos entre hilos. El uso directo de primitivas de bajo nivel como mutexes y semáforos es propenso a errores, como deadlocks, condiciones de carrera y violaciones de invariantes de datos. Estos problemas son difíciles de depurar debido a su naturaleza no determinista y pueden llevar a comportamientos impredecibles, corrupción de datos y fallos del sistema. Además, el código que utiliza primitivas de sincronización de bajo nivel suele ser complejo, difícil de mantener y frágil ante cambios.',
    
    solution: 'Un monitor encapsula el estado compartido y todas las operaciones que lo manipulan en un módulo protegido, imponiendo un acceso exclusivo a los datos. Los componentes clave son: 1) Datos internos privados que representan el estado compartido, 2) Métodos/procedimientos que proporcionan la única forma de acceder y modificar estos datos, 3) Un mecanismo de exclusión mutua que garantiza que solo un hilo puede ejecutar cualquier método del monitor a la vez, 4) Variables de condición que permiten a los hilos esperar hasta que se cumplan ciertas condiciones de estado. El monitor garantiza la atomicidad de sus operaciones, manteniendo los invariantes del objeto y simplificando el razonamiento sobre la correctitud del código concurrente. Las variables de condición permiten la sincronización a nivel de condición: los hilos pueden esperar cuando no pueden proceder (liberando temporalmente el mutex) y ser notificados cuando las condiciones cambian, permitiendo un uso eficiente de los recursos.',
    
    applicability: [
      'Sistemas multi-hilo donde varios hilos necesitan acceder y modificar datos compartidos',
      'Cuando se requiere encapsular la sincronización dentro de objetos que manejan recursos compartidos',
      'Para implementar abstracciones de sincronización de más alto nivel como colas de mensajes, buffers limitados o pools de recursos',
      'En la implementación de estructuras de datos thread-safe',
      'Para la coordinación entre productores y consumidores en un patrón productor-consumidor',
      'Cuando se necesita garantizar invariantes de datos en entornos concurrentes',
      'En la implementación de servicios que deben atender múltiples solicitudes concurrentes',
      'Para administrar el acceso a recursos limitados (como conexiones de bases de datos)',
      'En la implementación de mecanismos de bloqueo más complejos como lectores-escritores',
      'Cuando el código debe ejecutarse en entornos con múltiples núcleos o procesadores'
    ],
    
    consequences: [
      'Simplifica el razonamiento sobre código concurrente al encapsular la sincronización',
      'Reduce la probabilidad de errores de sincronización al centralizar el control de acceso',
      'Facilita el mantenimiento de invariantes de datos ya que los estados intermedios no son visibles',
      'Puede limitar el paralelismo al serializar todas las operaciones sobre el monitor',
      'Riesgo de deadlock si un método del monitor llama a otro monitor (problema de inversión de prioridad)',
      'Sobrecarga de rendimiento debido a la adquisición/liberación de bloqueos en cada llamada',
      'Mejora la modularidad al separar la lógica de sincronización de la lógica de la aplicación',
      'Permite razonamiento local sobre la correctitud del acceso concurrente',
      'Proporciona mayor nivel de abstracción que los primitivos de bajo nivel',
      'Puede causar contención de recursos si el monitor es un punto caliente de acceso'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Monitor?</h3>
      <ul>
        <li><strong>Estructuras de datos concurrentes:</strong> Cuando implementas colecciones, caches, o cualquier estructura de datos que será accedida por múltiples hilos. El monitor garantiza que las operaciones en la estructura mantienen su integridad.</li>
        <li><strong>Administración de recursos compartidos:</strong> Para gestionar recursos limitados como conexiones a bases de datos, archivos, o dispositivos hardware, garantizando acceso ordenado y evitando conflictos.</li>
        <li><strong>Coordinación entre hilos:</strong> Cuando necesitas implementar coordinación compleja entre hilos, como el patrón productor-consumidor, donde algunos hilos producen datos y otros los consumen.</li>
        <li><strong>Garantizar invariantes de objetos:</strong> Cuando un objeto debe mantener invariantes complejos (relaciones entre sus datos internos) incluso cuando es manipulado concurrentemente.</li>
        <li><strong>Implementación de sincronización personalizada:</strong> Cuando las primitivas estándar de sincronización no son suficientes y necesitas implementar protocolos más complejos.</li>
        <li><strong>Aislamiento de transacciones:</strong> Para implementar mecanismos simples de transacción donde múltiples operaciones deben ocurrir atómicamente desde la perspectiva de otros hilos.</li>
      </ul>
      
      <h3>Variantes y extensiones del patrón Monitor:</h3>
      <ul>
        <li><strong>Monitor con señales explícitas:</strong> Donde las señales para notificar a hilos bloqueados son gestionadas explícitamente por el programador, en lugar de automáticamente cuando se sale del monitor.</li>
        <li><strong>Monitor con prioridad:</strong> Donde los hilos tienen diferentes prioridades para acceder al monitor, evitando problemas como la inanición de hilos de baja prioridad.</li>
        <li><strong>Monitor con lectores/escritores:</strong> Una especialización que permite múltiples lectores concurrentes pero solo un escritor a la vez, optimizando para operaciones de solo lectura.</li>
        <li><strong>Monitor distribudo:</strong> Extensión para sistemas distribuidos donde el estado protegido puede estar distribuido entre diferentes nodos pero sigue manteniendo garantías de sincronización.</li>
        <li><strong>Monitor reentrante:</strong> Permite que un hilo que ya tiene el bloqueo vuelva a entrar al monitor sin deadlock, facilitando la implementación de métodos recursivos o que se llaman mutuamente.</li>
        <li><strong>Monitor con timeout:</strong> Permite especificar un tiempo máximo que un hilo esperará para obtener acceso o para que se cumpla una condición, evitando bloqueos indefinidos.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Conexiones de bases de datos:</strong> Los pools de conexiones utilizan monitores para gestionar un conjunto limitado de conexiones entre múltiples solicitantes:</li>
        <pre>
// Ejemplo conceptual de pool de conexiones
public class ConnectionPool {
    private final List<Connection> availableConnections;
    private final int maxConnections;
    
    public synchronized Connection getConnection() throws InterruptedException {
        while (availableConnections.isEmpty() && countTotalConnections() >= maxConnections) {
            // Esperar si no hay conexiones disponibles y ya se crearon todas las permitidas
            wait();
        }
        
        Connection conn;
        if (!availableConnections.isEmpty()) {
            // Reutilizar una conexión existente
            conn = availableConnections.remove(0);
        } else {
            // Crear una nueva conexión
            conn = createNewConnection();
        }
        
        return conn;
    }
    
    public synchronized void releaseConnection(Connection conn) {
        availableConnections.add(conn);
        // Notificar a un hilo que podría estar esperando una conexión
        notify();
    }
}
        </pre>
        
        <li><strong>Caché thread-safe:</strong> Implementación de un caché que puede ser accedido por múltiples hilos sin problemas de concurrencia:</li>
        <pre>
// Caché simple thread-safe usando el patrón Monitor
public class SimpleCache<K, V> {
    private final Map<K, V> cache = new HashMap<>();
    private final int capacity;
    
    public SimpleCache(int capacity) {
        this.capacity = capacity;
    }
    
    public synchronized V get(K key) {
        return cache.get(key);
    }
    
    public synchronized void put(K key, V value) {
        if (cache.size() >= capacity && !cache.containsKey(key)) {
            // Política de reemplazo simple: eliminar una entrada aleatoria
            K randomKey = cache.keySet().iterator().next();
            cache.remove(randomKey);
        }
        cache.put(key, value);
    }
    
    public synchronized int size() {
        return cache.size();
    }
}
        </pre>
        
        <li><strong>Cola de tareas:</strong> Para implementar sistemas de trabajo en segundo plano donde los productores añaden tareas y los trabajadores las procesan:</li>
        <pre>
// Cola de tareas thread-safe
public class TaskQueue<T> {
    private final Queue<T> tasks = new LinkedList<>();
    private final int maxTasks;
    private boolean isShutdown = false;
    
    public TaskQueue(int maxTasks) {
        this.maxTasks = maxTasks;
    }
    
    public synchronized void addTask(T task) throws InterruptedException {
        if (isShutdown) {
            throw new IllegalStateException("Queue is shutdown");
        }
        
        while (tasks.size() >= maxTasks) {
            wait();  // Esperar si la cola está llena
        }
        
        tasks.offer(task);
        notifyAll(); // Notificar a los trabajadores que hay una nueva tarea
    }
    
    public synchronized T getTask() throws InterruptedException {
        while (tasks.isEmpty() && !isShutdown) {
            wait(); // Esperar si no hay tareas y no está en shutdown
        }
        
        if (tasks.isEmpty() && isShutdown) {
            return null; // Señal de terminación
        }
        
        T task = tasks.poll();
        notifyAll(); // Notificar a los productores que hay espacio
        return task;
    }
    
    public synchronized void shutdown() {
        isShutdown = true;
        notifyAll(); // Despertar a todos los hilos esperando
    }
}
        </pre>
        
        <li><strong>Barrera de sincronización:</strong> Para coordinar múltiples hilos que deben esperar a que todos lleguen a un punto determinado:</li>
        <pre>
// Implementación de una barrera de sincronización
public class Barrier {
    private final int parties;
    private int count;
    private int generation = 0;
    
    public Barrier(int parties) {
        this.parties = parties;
        this.count = parties;
    }
    
    public synchronized void await() throws InterruptedException {
        int arrivalGeneration = generation;
        count--;
        
        if (count == 0) {
            // Último hilo en llegar
            count = parties; // Resetear para la próxima ronda
            generation++;   // Incrementar la generación
            notifyAll();    // Liberar a todos los hilos
            return;
        }
        
        // No es el último hilo, esperar
        while (arrivalGeneration == generation && count > 0) {
            wait();
        }
    }
}
        </pre>
      </ul>
      
      <h3>Diferencias de implementación entre lenguajes:</h3>
      <ul>
        <li><strong>Java:</strong> Proporciona soporte nativo para monitores a través de la palabra clave 'synchronized' y los métodos wait(), notify(), y notifyAll(). Cada objeto en Java tiene un monitor intrínseco asociado.</li>
        <li><strong>C#:</strong> Similar a Java, proporciona la palabra clave 'lock' (equivalente a synchronized) y los métodos Monitor.Enter/Exit, Monitor.Wait, Monitor.Pulse y Monitor.PulseAll.</li>
        <li><strong>C++:</strong> No tiene soporte nativo para monitores, pero se pueden implementar usando std::mutex, std::condition_variable y std::unique_lock de la biblioteca estándar.</li>
        <li><strong>Python:</strong> Proporciona la clase threading.Lock para exclusión mutua y threading.Condition para variables de condición, que pueden combinarse para implementar monitores.</li>
        <li><strong>Go:</strong> Fomenta un enfoque diferente usando canales para comunicación entre goroutines, aunque también proporciona sync.Mutex y sync.Cond para implementar monitores si es necesario.</li>
      </ul>
      
      <h3>Consideraciones de diseño e implementación:</h3>
      <ul>
        <li><strong>Granularidad de bloqueo:</strong> Determina qué tan específico es el bloqueo. Un monitor más grande (que protege más datos) simplifica la sincronización pero reduce el paralelismo. Monitores más pequeños y específicos aumentan el paralelismo pero complican la sincronización.</li>
        <li><strong>Prevención de deadlocks:</strong> Ten cuidado cuando un método del monitor llama a otro monitor o método sincronizado, ya que puede causar deadlocks. Establece un orden consistente para la adquisición de bloqueos.</li>
        <li><strong>Despertares espurios:</strong> Siempre usa un bucle while (no if) para verificar la condición después de wait(), ya que las variables de condición pueden despertar espontáneamente sin notificación.</li>
        <li><strong>Rendimiento:</strong> La sincronización tiene un costo. Minimiza el tiempo dentro de secciones sincronizadas y considera opciones como la sincronización de grano fino o estructuras de datos lock-free para código de alto rendimiento.</li>
        <li><strong>Consistencia del estado:</strong> Asegúrate de que el estado del monitor sea consistente antes de llamar a notify() o notifyAll(), para evitar que otros hilos vean un estado inválido.</li>
        <li><strong>Notificación dirigida:</strong> Cuando sea posible, prefiere notify() sobre notifyAll() para evitar despertar innecesariamente a todos los hilos. Sin embargo, notifyAll() es más seguro si varios hilos podrían estar esperando condiciones diferentes.</li>
        <li><strong>Timeout en esperas:</strong> Para evitar bloqueos indefinidos, considera usar métodos de espera con timeout (wait(timeout)).</li>
        <li><strong>Reentrada:</strong> Determina si tu monitor debe ser reentrante (permitir que el mismo hilo adquiera el bloqueo múltiples veces) o no, dependiendo de los requisitos.</li>
      </ul>
      
      <h3>Monitor vs Semáforo vs Mutex vs Lock-Free:</h3>
      <ul>
        <li><strong>Monitor:</strong> Es una abstracción de alto nivel que combina exclusión mutua con la capacidad de esperar por condiciones. Encapsula datos y métodos para facilitar el razonamiento sobre concurrencia.</li>
        <li><strong>Semáforo:</strong> Es una primitiva de sincronización más simple que permite a N hilos acceder a un recurso simultáneamente. No encapsula datos ni proporciona exclusión mutua automática para métodos.</li>
        <li><strong>Mutex:</strong> Es una primitiva de exclusión mutua básica que permite a un solo hilo acceder a un recurso. El monitor utiliza mutex internamente, pero añade encapsulación de datos y variables de condición.</li>
        <li><strong>Lock-Free (libre de bloqueos):</strong> Técnicas que evitan completamente los bloqueos utilizando operaciones atómicas e instrucciones de hardware especiales. Más complejo de implementar pero puede ofrecer mejor rendimiento en ciertos escenarios.</li>
        <li><strong>Read-Write Lock:</strong> Permite múltiples lectores simultáneos o un único escritor. Más granular que un monitor estándar, optimizando para casos donde las lecturas son mucho más frecuentes que las escrituras.</li>
      </ul>
    `
  }
};

export default monitorPattern; 