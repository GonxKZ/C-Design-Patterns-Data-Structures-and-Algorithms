const templateMethodPattern = {
  id: 'template-method',
  name: 'Template Method',
  category: 'behavioral',
  description: 'El patrón Template Method define el esqueleto de un algoritmo en una operación, posponiendo algunos pasos a las subclases. Permite que las subclases redefinan ciertos pasos de un algoritmo sin cambiar la estructura del mismo.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Clase abstracta que define el esqueleto del algoritmo
class AbstractClass {
public:
    // El Template Method que define el esqueleto del algoritmo
    void templateMethod() const {
        // Pasos comunes del algoritmo
        baseOperation1();
        
        // Pasos específicos que pueden ser sobrescritos
        requiredOperation1();
        requiredOperation2();
        
        // Otro paso común
        baseOperation2();
        
        // Gancho que se puede sobrescribir opcionalmente
        hook();
    }
    
    virtual ~AbstractClass() {}

protected:
    // Operaciones que ya están implementadas
    void baseOperation1() const {
        std::cout << "AbstractClass: Ejecutando la primera operación base." << std::endl;
    }
    
    void baseOperation2() const {
        std::cout << "AbstractClass: Ejecutando la segunda operación base." << std::endl;
    }
    
    // Operaciones que deben ser implementadas por las subclases
    virtual void requiredOperation1() const = 0;
    virtual void requiredOperation2() const = 0;
    
    // Operaciones con implementación por defecto (ganchos)
    virtual void hook() const {
        // Por defecto no hace nada, pero puede ser sobrescrita
    }
};

// Implementación concreta del algoritmo
class ConcreteClass1 : public AbstractClass {
protected:
    void requiredOperation1() const override {
        std::cout << "ConcreteClass1: Implementación de la operación requerida 1." << std::endl;
    }
    
    void requiredOperation2() const override {
        std::cout << "ConcreteClass1: Implementación de la operación requerida 2." << std::endl;
    }
};

// Otra implementación concreta que también sobrescribe el gancho
class ConcreteClass2 : public AbstractClass {
protected:
    void requiredOperation1() const override {
        std::cout << "ConcreteClass2: Implementación de la operación requerida 1." << std::endl;
    }
    
    void requiredOperation2() const override {
        std::cout << "ConcreteClass2: Implementación de la operación requerida 2." << std::endl;
    }
    
    void hook() const override {
        std::cout << "ConcreteClass2: Sobrescribiendo el gancho!" << std::endl;
    }
};

// Código cliente
void clientCode(const AbstractClass& abstractClass) {
    // El cliente llama al template method
    abstractClass.templateMethod();
}

int main() {
    std::cout << "Ejecutando código cliente con ConcreteClass1:" << std::endl;
    ConcreteClass1 concreteClass1;
    clientCode(concreteClass1);
    
    std::cout << std::endl;
    
    std::cout << "Ejecutando código cliente con ConcreteClass2:" << std::endl;
    ConcreteClass2 concreteClass2;
    clientCode(concreteClass2);
    
    return 0;
}`,
      explanation: [
        { line: 5, text: 'La clase abstracta que define la estructura del algoritmo con el Template Method.' },
        { line: 7, text: 'El Template Method que define la secuencia de los pasos del algoritmo.' },
        { line: 9, text: 'Llamada a una operación base común para todas las subclases.' },
        { line: 12, text: 'Llamadas a operaciones que deben ser implementadas por las subclases.' },
        { line: 16, text: 'Otra operación base común.' },
        { line: 19, text: 'Un gancho (hook) que las subclases pueden sobrescribir opcionalmente.' },
        { line: 34, text: 'Declaración de operaciones abstractas que deben ser implementadas por las subclases.' },
        { line: 38, text: 'Declaración de un gancho con implementación vacía por defecto.' },
        { line: 45, text: 'Una implementación concreta que implementa las operaciones requeridas.' },
        { line: 56, text: 'Otra implementación concreta que también sobrescribe el gancho opcional.' },
        { line: 70, text: 'Función cliente que utiliza cualquier subclase a través de la interfaz abstracta.' },
        { line: 76, text: 'En el main, creamos instancias de las clases concretas y las utilizamos a través del código cliente.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <functional>
#include <vector>

// Clase base que define el esqueleto del algoritmo
class DataProcessor {
public:
    // El Template Method que define el esqueleto del algoritmo
    void process(const std::string& data) {
        auto processedData = parse(data);
        
        if (validate(processedData)) {
            auto transformedData = transform(processedData);
            store(transformedData);
            
            // Notificación opcional
            if (shouldNotify()) {
                notify(transformedData);
            }
            
            // Limpieza final
            cleanup();
        } else {
            handleError("Datos inválidos");
        }
    }
    
    // Destructor virtual para clases base
    virtual ~DataProcessor() = default;

protected:
    // Pasos implementados en la clase base
    virtual std::string parse(const std::string& data) {
        std::cout << "DataProcessor: Parseando datos" << std::endl;
        return data;
    }
    
    // Pasos que deben implementar las clases derivadas
    virtual bool validate(const std::string& data) const = 0;
    virtual std::string transform(const std::string& data) const = 0;
    virtual void store(const std::string& data) const = 0;
    
    // Ganchos opcionales con implementación por defecto
    virtual bool shouldNotify() const {
        return false; // Por defecto no se notifica
    }
    
    virtual void notify(const std::string& data) const {
        std::cout << "DataProcessor: Notificando procesamiento de: " << data << std::endl;
    }
    
    virtual void cleanup() {
        std::cout << "DataProcessor: Limpieza estándar" << std::endl;
    }
    
    virtual void handleError(const std::string& errorMessage) const {
        std::cerr << "Error: " << errorMessage << std::endl;
    }
};

// Implementación concreta para procesar datos JSON
class JsonProcessor : public DataProcessor {
protected:
    bool validate(const std::string& data) const override {
        std::cout << "JsonProcessor: Validando formato JSON" << std::endl;
        // Simplificado: verifica si los datos contienen llaves
        return data.find('{') != std::string::npos && data.find('}') != std::string::npos;
    }
    
    std::string transform(const std::string& data) const override {
        std::cout << "JsonProcessor: Transformando datos JSON" << std::endl;
        // Simplificado: agrega un campo 'processed'
        return data.substr(0, data.length() - 1) + ", 'processed': true}";
    }
    
    void store(const std::string& data) const override {
        std::cout << "JsonProcessor: Almacenando datos JSON" << std::endl;
        // Simplificado: solo muestra los datos
        std::cout << "  -> " << data << std::endl;
    }
    
    // No sobrescribe shouldNotify(), usa el comportamiento por defecto (false)
};

// Implementación concreta para procesar datos XML
class XmlProcessor : public DataProcessor {
private:
    bool notificationsEnabled = true;

protected:
    std::string parse(const std::string& data) override {
        std::cout << "XmlProcessor: Parseando XML con parser especializado" << std::endl;
        return data; // Simplificado
    }
    
    bool validate(const std::string& data) const override {
        std::cout << "XmlProcessor: Validando estructura XML" << std::endl;
        // Simplificado: verifica si los datos contienen etiquetas
        return data.find('<') != std::string::npos && data.find('>') != std::string::npos;
    }
    
    std::string transform(const std::string& data) const override {
        std::cout << "XmlProcessor: Transformando datos XML" << std::endl;
        // Simplificado: agrega un atributo 'processed'
        std::string result = data;
        auto pos = result.find('>');
        if (pos != std::string::npos) {
            result.insert(pos, " processed='true'");
        }
        return result;
    }
    
    void store(const std::string& data) const override {
        std::cout << "XmlProcessor: Almacenando datos XML" << std::endl;
        std::cout << "  -> " << data << std::endl;
    }
    
    bool shouldNotify() const override {
        return notificationsEnabled; // Sobrescribe el comportamiento por defecto
    }
    
    void notify(const std::string& data) const override {
        std::cout << "XmlProcessor: Enviando notificación personalizada para XML" << std::endl;
    }
    
    void cleanup() override {
        std::cout << "XmlProcessor: Realizando limpieza especializada para XML" << std::endl;
    }
};

// Función de prueba
void testProcessor(DataProcessor& processor, const std::string& data) {
    std::cout << "\nProcesando: " << data << std::endl;
    processor.process(data);
}

int main() {
    // Datos de prueba
    std::string jsonData = "{'name': 'John', 'age': 30}";
    std::string xmlData = "<user><name>John</name><age>30</age></user>";
    std::string invalidData = "Este no es un formato válido";
    
    // Procesadores
    JsonProcessor jsonProcessor;
    XmlProcessor xmlProcessor;
    
    // Pruebas
    testProcessor(jsonProcessor, jsonData);
    testProcessor(jsonProcessor, invalidData); // Debería fallar en validación
    
    testProcessor(xmlProcessor, xmlData);
    
    return 0;
}`,
      explanation: [
        { line: 7, text: 'La clase base DataProcessor define una interfaz para el patrón Template Method en un contexto de procesamiento de datos.' },
        { line: 10, text: 'El método process es el Template Method que define la secuencia de pasos del algoritmo.' },
        { line: 17, text: 'Un condicional que decide si ejecutar un paso opcional (gancho).' },
        { line: 32, text: 'Método parse con implementación por defecto que puede ser sobrescrito.' },
        { line: 38, text: 'Métodos abstractos que deben ser implementados por las subclases.' },
        { line: 43, text: 'Gancho shouldNotify que por defecto devuelve false pero puede ser sobrescrito.' },
        { line: 60, text: 'JsonProcessor implementa las operaciones requeridas para procesar datos JSON.' },
        { line: 83, text: 'XmlProcessor implementa las operaciones para procesar datos XML y sobrescribe múltiples ganchos opcionales.' },
        { line: 85, text: 'Variable privada para controlar si las notificaciones están habilitadas.' },
        { line: 88, text: 'Sobrescribe el método parse para usar un parser especializado.' },
        { line: 114, text: 'Sobrescribe shouldNotify para habilitar notificaciones.' },
        { line: 126, text: 'Función testProcessor que muestra cómo usar un procesador con diferentes datos.' },
        { line: 132, text: 'En el main, creamos datos de prueba y procesadores para demostrar el patrón.' }
      ]
    },
    
    java: {
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

// Clase abstracta que define el esqueleto del algoritmo
abstract class ReportGenerator {
    // El Template Method que define el esqueleto del algoritmo
    public final void generateReport() {
        collectData();
        
        if (analyzeData()) {
            List<String> processedData = processData();
            formatReport(processedData);
            
            // Paso opcional basado en condición
            if (shouldSendReport()) {
                sendReport();
            }
            
            // Pasos finales
            logCompletion();
        } else {
            handleNoData();
        }
    }
    
    // Pasos con implementaciones por defecto
    protected void collectData() {
        System.out.println("ReportGenerator: Recopilando datos generales");
    }
    
    protected void logCompletion() {
        System.out.println("ReportGenerator: Registro de finalización estándar");
    }
    
    protected void handleNoData() {
        System.out.println("ReportGenerator: No hay datos para generar el informe");
    }
    
    // Pasos que deben ser implementados por las subclases
    protected abstract boolean analyzeData();
    protected abstract List<String> processData();
    protected abstract void formatReport(List<String> data);
    
    // Ganchos opcionales con implementación por defecto
    protected boolean shouldSendReport() {
        return false; // Por defecto no se envía
    }
    
    protected void sendReport() {
        System.out.println("ReportGenerator: Enviando informe por canal predeterminado");
    }
}

// Implementación concreta para informes de ventas
class SalesReportGenerator extends ReportGenerator {
    private final double minimumSalesThreshold;
    private List<Double> salesData;
    
    public SalesReportGenerator(double minimumSalesThreshold) {
        this.minimumSalesThreshold = minimumSalesThreshold;
        this.salesData = new ArrayList<>();
    }
    
    @Override
    protected void collectData() {
        System.out.println("SalesReportGenerator: Recopilando datos de ventas específicos");
        // Simulamos datos de ventas
        salesData.add(1200.0);
        salesData.add(850.75);
        salesData.add(1500.25);
    }
    
    @Override
    protected boolean analyzeData() {
        if (salesData.isEmpty()) {
            return false;
        }
        
        double totalSales = salesData.stream().mapToDouble(Double::doubleValue).sum();
        System.out.println("SalesReportGenerator: Analizando datos de ventas. Total: " + totalSales);
        
        return totalSales >= minimumSalesThreshold;
    }
    
    @Override
    protected List<String> processData() {
        System.out.println("SalesReportGenerator: Procesando datos de ventas");
        List<String> processedData = new ArrayList<>();
        
        for (int i = 0; i < salesData.size(); i++) {
            processedData.add("Venta " + (i + 1) + ": $" + salesData.get(i));
        }
        
        // Añadir total
        double total = salesData.stream().mapToDouble(Double::doubleValue).sum();
        processedData.add("Total de ventas: $" + total);
        
        return processedData;
    }
    
    @Override
    protected void formatReport(List<String> data) {
        System.out.println("SalesReportGenerator: Formateando informe de ventas");
        System.out.println("===== INFORME DE VENTAS =====");
        
        data.forEach(System.out::println);
        
        System.out.println("============================");
    }
    
    // No sobrescribimos shouldSendReport, usará el comportamiento por defecto (false)
}

// Implementación concreta para informes de inventario
class InventoryReportGenerator extends ReportGenerator {
    private List<String> inventoryData;
    private boolean sendNotifications;
    
    public InventoryReportGenerator(boolean sendNotifications) {
        this.sendNotifications = sendNotifications;
        this.inventoryData = new ArrayList<>();
    }
    
    @Override
    protected void collectData() {
        System.out.println("InventoryReportGenerator: Recopilando datos de inventario");
        // Simulamos datos de inventario
        inventoryData.add("Producto A: 150 unidades");
        inventoryData.add("Producto B: 75 unidades");
        inventoryData.add("Producto C: 320 unidades");
    }
    
    @Override
    protected boolean analyzeData() {
        boolean hasData = !inventoryData.isEmpty();
        System.out.println("InventoryReportGenerator: Analizando datos de inventario. Datos disponibles: " + hasData);
        return hasData;
    }
    
    @Override
    protected List<String> processData() {
        System.out.println("InventoryReportGenerator: Procesando datos de inventario");
        // Para este ejemplo, no procesamos más los datos
        return new ArrayList<>(inventoryData);
    }
    
    @Override
    protected void formatReport(List<String> data) {
        System.out.println("InventoryReportGenerator: Formateando informe de inventario");
        System.out.println("---- INFORME DE INVENTARIO ----");
        
        for (String item : data) {
            System.out.println("* " + item);
        }
        
        System.out.println("------------------------------");
    }
    
    @Override
    protected boolean shouldSendReport() {
        return sendNotifications; // Configurable en el constructor
    }
    
    @Override
    protected void sendReport() {
        System.out.println("InventoryReportGenerator: Enviando informe de inventario a supervisores");
    }
    
    @Override
    protected void logCompletion() {
        System.out.println("InventoryReportGenerator: Registrando generación de informe de inventario en log detallado");
    }
}

// Demo del patrón Template Method
public class TemplateMethodDemo {
    public static void main(String[] args) {
        System.out.println("Generando informe de ventas:");
        ReportGenerator salesReport = new SalesReportGenerator(1000);
        salesReport.generateReport();
        
        System.out.println("\nGenerando informe de inventario con notificaciones:");
        ReportGenerator inventoryReport = new InventoryReportGenerator(true);
        inventoryReport.generateReport();
        
        System.out.println("\nGenerando informe de inventario sin notificaciones:");
        ReportGenerator inventoryReportNoNotif = new InventoryReportGenerator(false);
        inventoryReportNoNotif.generateReport();
    }
}`,
      explanation: [
        { line: 6, text: 'La clase abstracta ReportGenerator define la estructura del algoritmo para generar informes.' },
        { line: 8, text: 'El Template Method generateReport que define la secuencia de pasos.' },
        { line: 14, text: 'Condicional que decide si ejecutar un paso opcional basado en un método gancho.' },
        { line: 26, text: 'Implementaciones por defecto de algunos pasos que pueden ser sobrescritos.' },
        { line: 38, text: 'Métodos abstractos que deben ser implementados por las subclases.' },
        { line: 43, text: 'Ganchos opcionales con implementación por defecto.' },
        { line: 53, text: 'SalesReportGenerator es una implementación concreta para informes de ventas.' },
        { line: 54, text: 'Campos específicos para esta implementación.' },
        { line: 64, text: 'Sobrescribe collectData para implementar recopilación de datos específica para ventas.' },
        { line: 73, text: 'Implementa analyzeData para verificar si hay suficientes ventas para generar el informe.' },
        { line: 85, text: 'Implementa processData para formatear los datos de ventas.' },
        { line: 100, text: 'Implementa formatReport para crear el informe de ventas formateado.' },
        { line: 113, text: 'InventoryReportGenerator es otra implementación concreta para informes de inventario.' },
        { line: 115, text: 'Campo para configurar si se envían notificaciones.' },
        { line: 153, text: 'Sobrescribe shouldSendReport para usar el valor configurado.' },
        { line: 158, text: 'Sobrescribe sendReport para implementar el envío específico para informes de inventario.' },
        { line: 168, text: 'La clase de demostración muestra cómo usar el patrón con diferentes implementaciones.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Enfoque y aplicación',
      cppTraditional: 'Implementación básica centrada en mostrar la estructura del patrón con operaciones abstractas y ganchos opcionales.',
      cppModern: 'Versión más práctica que aplica el patrón a un caso de uso de procesamiento de datos con diferentes formatos (JSON, XML) y mayor flexibilidad.',
      java: 'Aplicación del patrón a un caso de generación de informes, con implementaciones concretas para diferentes tipos de informes y configuraciones variables.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'Estructura rígida con pasos predefinidos y pocas opciones de personalización más allá de implementar métodos abstractos.',
      cppModern: 'Mayor flexibilidad con múltiples puntos de extensión, permitiendo sobrescribir incluso los métodos con implementación por defecto para comportamientos especializados.',
      java: 'Alto nivel de flexibilidad con configuración en tiempo de ejecución a través de parámetros en el constructor, facilitando la personalización sin necesidad de subclases adicionales.'
    },
    {
      title: 'Uso de características del lenguaje',
      cppTraditional: 'Utiliza conceptos básicos de POO como clases abstractas, métodos virtuales y herencia.',
      cppModern: 'Aprovecha características modernas como tipos de retorno automáticos, gestión de memoria moderna y estructuras de datos más sofisticadas.',
      java: 'Explota características de Java como streams, lambdas y referencias a métodos para implementaciones más concisas y expresivas.'
    }
  ],
  
  theory: {
    background: 'El patrón Template Method fue introducido como parte de los 23 patrones de diseño del Gang of Four (GoF). Este patrón es fundamental en diseño orientado a objetos y aprovecha la herencia para distribuir algoritmos entre clases.',
    problem: 'Cuando varias clases contienen algoritmos similares con algunas diferencias en ciertos pasos, hay duplicación de código. Los cambios en la estructura común del algoritmo requieren modificaciones en múltiples clases, lo que es propenso a errores y difícil de mantener.',
    solution: 'El patrón Template Method define un esqueleto de algoritmo en un método en la clase base, delegando algunos pasos a las subclases. El template method protege la estructura global del algoritmo mientras permite a las subclases sobrescribir pasos específicos sin cambiar su estructura.',
    applicability: [
      'Cuando se quiere permitir a los clientes extender solo pasos particulares de un algoritmo, pero no toda la estructura.',
      'Cuando se tiene un código común entre varias clases que solo difiere en algunos aspectos específicos.',
      'Cuando se quiere controlar en qué puntos las subclases pueden variar el comportamiento de un algoritmo.',
      'Para implementar el principio "Hollywood" (no nos llames, nosotros te llamaremos): la clase base llama a los métodos de las subclases en momentos específicos.',
      'Para evitar duplicación de código en clases con algoritmos similares.'
    ],
    benefits: [
      'Reutilización de código: las partes invariantes del algoritmo se implementan una vez en la clase abstracta.',
      'Extensibilidad controlada: las subclases pueden personalizar el comportamiento en puntos específicos sin alterar la estructura general.',
      'Inversión de control: la clase base controla el flujo del algoritmo y llama a los métodos específicos de las subclases.',
      'Facilita la aplicación del principio Open/Closed: la estructura está cerrada a modificaciones pero abierta a extensiones.',
      'Proporciona ganchos (hooks) que permiten extensión opcional sin forzar la sobrescritura.'
    ],
    drawbacks: [
      'Las limitaciones impuestas por la estructura fija pueden resultar restrictivas para ciertos casos de uso.',
      'La depuración puede ser más difícil debido a la inversión de control y la separación de los pasos del algoritmo.',
      'Los cambios en la estructura del template method pueden requerir modificaciones en numerosas subclases.',
      'Puede llevar a una jerarquía de clases compleja si se requieren múltiples variaciones del algoritmo.',
      'El uso excesivo de ganchos puede hacer que el código sea más difícil de entender y mantener.'
    ]
  }
};

export default templateMethodPattern;
