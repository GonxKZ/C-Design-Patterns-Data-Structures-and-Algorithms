const bridgePattern = {
  id: 'bridge',
  name: 'Bridge',
  category: 'structural',
  description: 'Separa una abstracción de su implementación para que ambas puedan variar independientemente. Este patrón desacopla una interfaz de su implementación, permitiendo que evolucionen separadamente y favoreciendo la flexibilidad y extensibilidad del sistema.',
  
  implementations: {
    cppTraditional: {
      code: `#include <iostream>
#include <string>

// Implementación
class DeviceImplementation {
public:
    virtual ~DeviceImplementation() {}
    virtual void turnOn() = 0;
    virtual void turnOff() = 0;
    virtual void setVolume(int percent) = 0;
    virtual void setChannel(int channel) = 0;
    virtual int getVolume() const = 0;
    virtual int getChannel() const = 0;
    virtual bool isEnabled() const = 0;
};

// Implementación concreta: TV
class TV : public DeviceImplementation {
private:
    bool enabled;
    int volume;
    int channel;

public:
    TV() : enabled(false), volume(30), channel(1) {}
    
    void turnOn() override {
        enabled = true;
        std::cout << "TV: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "TV: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        volume = percent;
        std::cout << "TV: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int newChannel) override {
        channel = newChannel;
        std::cout << "TV: canal cambiado a " << channel << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Implementación concreta: Radio
class Radio : public DeviceImplementation {
private:
    bool enabled;
    int volume;
    int channel; // Frecuencia de la emisora

public:
    Radio() : enabled(false), volume(20), channel(93) {}
    
    void turnOn() override {
        enabled = true;
        std::cout << "Radio: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "Radio: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        volume = percent;
        std::cout << "Radio: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int frequency) override {
        channel = frequency;
        std::cout << "Radio: frecuencia cambiada a " << channel << " MHz" << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Abstracción
class RemoteControl {
protected:
    DeviceImplementation* device;
    
public:
    RemoteControl(DeviceImplementation* device) : device(device) {}
    virtual ~RemoteControl() {}
    
    void togglePower() {
        if (device->isEnabled()) {
            device->turnOff();
        } else {
            device->turnOn();
        }
    }
    
    void volumeUp() {
        device->setVolume(device->getVolume() + 10);
    }
    
    void volumeDown() {
        device->setVolume(device->getVolume() - 10);
    }
    
    void channelUp() {
        device->setChannel(device->getChannel() + 1);
    }
    
    void channelDown() {
        device->setChannel(device->getChannel() - 1);
    }
};

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl : public RemoteControl {
public:
    AdvancedRemoteControl(DeviceImplementation* device) : RemoteControl(device) {}
    
    void mute() {
        device->setVolume(0);
        std::cout << "Dispositivo silenciado" << std::endl;
    }
    
    void setChannel(int channel) {
        device->setChannel(channel);
        std::cout << "Canal configurado directamente a " << channel << std::endl;
    }
};

// Función de demostración
void clientCode() {
    std::cout << "Ejemplo con TV y control básico:" << std::endl;
    TV* tv = new TV();
    RemoteControl* basicRemote = new RemoteControl(tv);
    
    basicRemote->togglePower();
    basicRemote->volumeUp();
    basicRemote->channelUp();
    basicRemote->channelUp();
    
    std::cout << "\nEjemplo con Radio y control avanzado:" << std::endl;
    Radio* radio = new Radio();
    AdvancedRemoteControl* advancedRemote = new AdvancedRemoteControl(radio);
    
    advancedRemote->togglePower();
    advancedRemote->volumeUp();
    advancedRemote->setChannel(101);
    advancedRemote->mute();
    
    // Limpieza
    delete basicRemote;
    delete tv;
    delete advancedRemote;
    delete radio;
}

int main() {
    clientCode();
    return 0;
}`,
      explanation: [
        { line: 4, text: 'Definimos la interfaz de implementación DeviceImplementation que define los métodos que deben implementar todos los dispositivos.' },
        { line: 15, text: 'Implementación concreta: TV que implementa la interfaz DeviceImplementation.' },
        { line: 57, text: 'Implementación concreta: Radio que también implementa la interfaz DeviceImplementation.' },
        { line: 99, text: 'Abstracción: RemoteControl que utiliza un puntero a la implementación.' },
        { line: 104, text: 'Constructor que recibe un puntero a la implementación, estableciendo el puente.' },
        { line: 107, text: 'Método togglePower que utiliza los métodos de la implementación.' },
        { line: 129, text: 'Abstracción refinada: AdvancedRemoteControl que extiende la funcionalidad básica.' },
        { line: 142, text: 'Función de demostración que muestra cómo usar las abstracciones con diferentes implementaciones.' },
        { line: 144, text: 'Creamos una TV y un control básico.' },
        { line: 151, text: 'Creamos una Radio y un control avanzado.' },
        { line: 159, text: 'Liberamos la memoria manualmente ya que estamos usando punteros crudos.' }
      ]
    },
    
    cppModern: {
      code: `#include <iostream>
#include <string>
#include <memory>
#include <functional>

// Implementación
class DeviceImplementation {
public:
    virtual ~DeviceImplementation() = default;
    virtual void turnOn() = 0;
    virtual void turnOff() = 0;
    virtual void setVolume(int percent) = 0;
    virtual void setChannel(int channel) = 0;
    virtual int getVolume() const = 0;
    virtual int getChannel() const = 0;
    virtual bool isEnabled() const = 0;
};

// Implementación concreta: TV
class TV : public DeviceImplementation {
private:
    bool enabled{false};
    int volume{30};
    int channel{1};

public:
    void turnOn() override {
        enabled = true;
        std::cout << "TV: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "TV: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        volume = std::clamp(percent, 0, 100);
        std::cout << "TV: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int newChannel) override {
        channel = newChannel;
        std::cout << "TV: canal cambiado a " << channel << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Implementación concreta: Radio
class Radio : public DeviceImplementation {
private:
    bool enabled{false};
    int volume{20};
    int channel{93}; // Frecuencia de la emisora

public:
    void turnOn() override {
        enabled = true;
        std::cout << "Radio: encendida" << std::endl;
    }
    
    void turnOff() override {
        enabled = false;
        std::cout << "Radio: apagada" << std::endl;
    }
    
    void setVolume(int percent) override {
        volume = std::clamp(percent, 0, 100);
        std::cout << "Radio: volumen establecido a " << volume << "%" << std::endl;
    }
    
    void setChannel(int frequency) override {
        channel = frequency;
        std::cout << "Radio: frecuencia cambiada a " << channel << " MHz" << std::endl;
    }
    
    int getVolume() const override {
        return volume;
    }
    
    int getChannel() const override {
        return channel;
    }
    
    bool isEnabled() const override {
        return enabled;
    }
};

// Abstracción
class RemoteControl {
protected:
    std::shared_ptr<DeviceImplementation> device;
    
public:
    explicit RemoteControl(std::shared_ptr<DeviceImplementation> dev) : device(std::move(dev)) {}
    virtual ~RemoteControl() = default;
    
    void togglePower() {
        if (device->isEnabled()) {
            device->turnOff();
        } else {
            device->turnOn();
        }
    }
    
    void volumeUp() {
        device->setVolume(device->getVolume() + 10);
    }
    
    void volumeDown() {
        device->setVolume(device->getVolume() - 10);
    }
    
    void channelUp() {
        device->setChannel(device->getChannel() + 1);
    }
    
    void channelDown() {
        device->setChannel(device->getChannel() - 1);
    }
};

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl : public RemoteControl {
public:
    explicit AdvancedRemoteControl(std::shared_ptr<DeviceImplementation> dev) : RemoteControl(std::move(dev)) {}
    
    void mute() {
        device->setVolume(0);
        std::cout << "Dispositivo silenciado" << std::endl;
    }
    
    void setChannel(int channel) {
        device->setChannel(channel);
        std::cout << "Canal configurado directamente a " << channel << std::endl;
    }
};

// Función de demostración con Smart Pointers
void clientCode() {
    std::cout << "Ejemplo con TV y control básico:" << std::endl;
    auto tv = std::make_shared<TV>();
    auto basicRemote = std::make_unique<RemoteControl>(tv);
    
    basicRemote->togglePower();
    basicRemote->volumeUp();
    basicRemote->channelUp();
    basicRemote->channelUp();
    
    std::cout << "\nEjemplo con Radio y control avanzado:" << std::endl;
    auto radio = std::make_shared<Radio>();
    auto advancedRemote = std::make_unique<AdvancedRemoteControl>(radio);
    
    advancedRemote->togglePower();
    advancedRemote->volumeUp();
    advancedRemote->setChannel(101);
    advancedRemote->mute();
    
    // No es necesario eliminar explícitamente, los smart pointers se encargan automáticamente
}

// Ejemplo de uso con un dispositivo compartido
void sharedDeviceExample() {
    std::cout << "\nEjemplo de dispositivo compartido:" << std::endl;
    auto tv = std::make_shared<TV>();
    
    auto basicRemote = std::make_unique<RemoteControl>(tv);
    auto advancedRemote = std::make_unique<AdvancedRemoteControl>(tv);
    
    basicRemote->togglePower(); // Enciende la TV
    advancedRemote->setChannel(5); // Ambos controles operan sobre la misma TV
    basicRemote->volumeUp(); // Ambos controles afectan al mismo volumen
}

int main() {
    clientCode();
    sharedDeviceExample();
    return 0;
}`,
      explanation: [
        { line: 3, text: 'Incluimos bibliotecas para smart pointers y funciones auxiliares.' },
        { line: 7, text: 'Usamos = default para el destructor virtual, siguiendo las mejores prácticas de C++ moderno.' },
        { line: 19, text: 'Inicializamos las variables miembro con inicializadores en línea (C++11).' },
        { line: 35, text: 'Utilizamos std::clamp para asegurar que el volumen esté dentro del rango válido.' },
        { line: 99, text: 'Usamos std::shared_ptr para el dispositivo, permitiendo que múltiples controles compartan el mismo dispositivo.' },
        { line: 101, text: 'El constructor usa explicit para evitar conversiones implícitas no deseadas y std::move para transferencia eficiente.' },
        { line: 102, text: 'Usamos = default para el destructor virtual, simplificando el código.' },
        { line: 132, text: 'La abstracción refinada también utiliza std::move para transferencia eficiente del puntero compartido.' },
        { line: 146, text: 'Creamos objetos usando std::make_shared y std::make_unique, que es más eficiente y seguro.' },
        { line: 159, text: 'No necesitamos delete explícito, los smart pointers manejan automáticamente la liberación de memoria.' },
        { line: 164, text: 'Ejemplo adicional que muestra cómo múltiples controles pueden operar sobre el mismo dispositivo.' },
        { line: 167, text: 'Un dispositivo compartido (tv) es usado por dos controles diferentes, demostrando la flexibilidad del patrón.' }
      ]
    },
    
    java: {
      code: `import java.util.function.Consumer;

// Interfaz de implementación
interface DeviceImplementation {
    void turnOn();
    void turnOff();
    void setVolume(int percent);
    void setChannel(int channel);
    int getVolume();
    int getChannel();
    boolean isEnabled();
}

// Implementación concreta: TV
class TV implements DeviceImplementation {
    private boolean enabled = false;
    private int volume = 30;
    private int channel = 1;
    
    @Override
    public void turnOn() {
        enabled = true;
        System.out.println("TV: encendida");
    }
    
    @Override
    public void turnOff() {
        enabled = false;
        System.out.println("TV: apagada");
    }
    
    @Override
    public void setVolume(int percent) {
        volume = Math.max(0, Math.min(100, percent));
        System.out.println("TV: volumen establecido a " + volume + "%");
    }
    
    @Override
    public void setChannel(int newChannel) {
        channel = newChannel;
        System.out.println("TV: canal cambiado a " + channel);
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public int getChannel() {
        return channel;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

// Implementación concreta: Radio
class Radio implements DeviceImplementation {
    private boolean enabled = false;
    private int volume = 20;
    private int channel = 93; // Frecuencia de la emisora
    
    @Override
    public void turnOn() {
        enabled = true;
        System.out.println("Radio: encendida");
    }
    
    @Override
    public void turnOff() {
        enabled = false;
        System.out.println("Radio: apagada");
    }
    
    @Override
    public void setVolume(int percent) {
        volume = Math.max(0, Math.min(100, percent));
        System.out.println("Radio: volumen establecido a " + volume + "%");
    }
    
    @Override
    public void setChannel(int frequency) {
        channel = frequency;
        System.out.println("Radio: frecuencia cambiada a " + channel + " MHz");
    }
    
    @Override
    public int getVolume() {
        return volume;
    }
    
    @Override
    public int getChannel() {
        return channel;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

// Abstracción
class RemoteControl {
    protected DeviceImplementation device;
    
    public RemoteControl(DeviceImplementation device) {
        this.device = device;
    }
    
    public void togglePower() {
        if (device.isEnabled()) {
            device.turnOff();
        } else {
            device.turnOn();
        }
    }
    
    public void volumeUp() {
        device.setVolume(device.getVolume() + 10);
    }
    
    public void volumeDown() {
        device.setVolume(device.getVolume() - 10);
    }
    
    public void channelUp() {
        device.setChannel(device.getChannel() + 1);
    }
    
    public void channelDown() {
        device.setChannel(device.getChannel() - 1);
    }
}

// Abstracción refinada: Control avanzado
class AdvancedRemoteControl extends RemoteControl {
    public AdvancedRemoteControl(DeviceImplementation device) {
        super(device);
    }
    
    public void mute() {
        device.setVolume(0);
        System.out.println("Dispositivo silenciado");
    }
    
    public void setChannel(int channel) {
        device.setChannel(channel);
        System.out.println("Canal configurado directamente a " + channel);
    }
}

// Uso con expresiones lambda para operaciones en secuencia
class RemoteControlOperations {
    public static void performOperations(RemoteControl remote, Consumer<RemoteControl> operations) {
        operations.accept(remote);
    }
}

// Clase de demostración
public class BridgeDemo {
    public static void main(String[] args) {
        System.out.println("Ejemplo con TV y control básico:");
        DeviceImplementation tv = new TV();
        RemoteControl basicRemote = new RemoteControl(tv);
        
        basicRemote.togglePower();
        basicRemote.volumeUp();
        basicRemote.channelUp();
        basicRemote.channelUp();
        
        System.out.println("\nEjemplo con Radio y control avanzado:");
        DeviceImplementation radio = new Radio();
        AdvancedRemoteControl advancedRemote = new AdvancedRemoteControl(radio);
        
        advancedRemote.togglePower();
        advancedRemote.volumeUp();
        advancedRemote.setChannel(101);
        advancedRemote.mute();
        
        // Ejemplo de operaciones encadenadas con lambdas
        System.out.println("\nOperaciones encadenadas con lambdas:");
        RemoteControlOperations.performOperations(basicRemote, remote -> {
            remote.togglePower(); // Apaga la TV
            remote.togglePower(); // La vuelve a encender
            remote.channelUp();
            remote.volumeUp();
        });
        
        // Ejemplo de dispositivo compartido
        System.out.println("\nEjemplo de dispositivo compartido:");
        DeviceImplementation sharedTV = new TV();
        RemoteControl remoteInLivingRoom = new RemoteControl(sharedTV);
        AdvancedRemoteControl remoteInBedroom = new AdvancedRemoteControl(sharedTV);
        
        remoteInLivingRoom.togglePower(); // Enciende la TV
        remoteInBedroom.setChannel(5); // Ambos controles operan sobre la misma TV
        remoteInLivingRoom.volumeUp(); // Ambos controles afectan al mismo volumen
    }
}`,
      explanation: [
        { line: 1, text: 'Importamos la interfaz Consumer para usar lambdas en el ejemplo avanzado.' },
        { line: 4, text: 'Definimos la interfaz DeviceImplementation que establece los métodos requeridos para implementaciones concretas.' },
        { line: 14, text: 'La clase TV implementa la interfaz DeviceImplementation.' },
        { line: 31, text: 'Usamos Math.max y Math.min para asegurar que el volumen esté dentro del rango válido.' },
        { line: 56, text: 'La clase Radio implementa la misma interfaz, permitiendo diferentes implementaciones.' },
        { line: 98, text: 'La clase RemoteControl es la abstracción que usa la implementación a través de la interfaz.' },
        { line: 126, text: 'AdvancedRemoteControl extiende la abstracción básica, añadiendo funcionalidades adicionales.' },
        { line: 142, text: 'Clase auxiliar que muestra cómo usar lambdas con el patrón Bridge para encadenar operaciones.' },
        { line: 144, text: 'Método estático que acepta un control remoto y un Consumer que define operaciones a realizar.' },
        { line: 165, text: 'En el ejemplo principal, creamos las implementaciones y abstracciones.' },
        { line: 179, text: 'Ejemplo avanzado que usa lambdas para encadenar operaciones en un control remoto.' },
        { line: 188, text: 'Ejemplo adicional que demuestra cómo múltiples controles pueden operar sobre el mismo dispositivo.' }
      ]
    }
  },
  
  comparisons: [
    {
      title: 'Gestión de memoria',
      cppTraditional: 'Usa punteros crudos y delete explícito, lo que puede llevar a fugas de memoria si no se maneja correctamente.',
      cppModern: 'Utiliza smart pointers (shared_ptr y unique_ptr) para gestión automática de memoria, evitando fugas y simplificando el código.',
      java: 'La gestión de memoria es automática gracias al recolector de basura, eliminando la necesidad de liberar memoria manualmente.'
    },
    {
      title: 'Seguridad y robustez',
      cppTraditional: 'Más propenso a errores como desreferenciación de punteros nulos o fugas de memoria si no se tiene cuidado.',
      cppModern: 'Mayor seguridad con smart pointers, valores por defecto y std::clamp para validación de rangos, minimizando errores potenciales.',
      java: 'Proporciona comprobación de tipos en tiempo de compilación y manejo de nulos más seguro con la posibilidad de usar Optional en versiones recientes.'
    },
    {
      title: 'Flexibilidad y extensibilidad',
      cppTraditional: 'La implementación básica ya soporta la separación de abstracción e implementación, pero con menos opciones de extensión.',
      cppModern: 'Mayor flexibilidad gracias a los punteros compartidos que permiten que múltiples abstracciones utilicen la misma implementación concurrentemente.',
      java: 'Alta extensibilidad a través de interfaces y clases abstractas, con opciones adicionales como expresiones lambda para operaciones compuestas.'
    }
  ],
  
  theory: {
    background: 'El patrón Bridge fue formalizado por la Banda de los Cuatro (GoF) como una solución al problema de la herencia múltiple y las jerarquías de clases explosivas. Su fundamento es el principio "preferir la composición sobre la herencia", facilitando la separación de preocupaciones y la evolución independiente de diferentes aspectos del sistema.',
    
    problem: 'En diseño orientado a objetos, la herencia puede crear jerarquías de clases complejas cuando una clase varía en múltiples dimensiones independientes. Por ejemplo, si tenemos varios tipos de formas (círculos, cuadrados) y varias formas de renderizarlas (vector, raster), una solución basada solo en herencia crearía combinaciones explosivas (CirculoVector, CirculoRaster, CuadradoVector, CuadradoRaster, etc.). Esto genera código duplicado, dificulta la extensibilidad y complica el mantenimiento.',
    
    solution: 'El patrón Bridge resuelve este problema dividiendo el diseño en dos jerarquías: una para las abstracciones (lo que el cliente ve) y otra para las implementaciones (cómo se realiza el trabajo). La abstracción contiene una referencia a la implementación, creando un "puente" entre ambas. Esto permite que ambas jerarquías evolucionen independientemente sin afectarse mutuamente.',
    
    applicability: [
      'Cuando deseas evitar un vínculo permanente entre una abstracción y su implementación',
      'Cuando tanto la abstracción como la implementación deben ser extensibles mediante subclases',
      'Cuando los cambios en la implementación no deben impactar en el código del cliente',
      'Cuando tienes una proliferación explosiva de clases debido a la combinación de múltiples dimensiones de variación',
      'Cuando quieres compartir una implementación entre múltiples objetos y ocultarlo del cliente'
    ],
    
    consequences: [
      'Desacopla la interfaz de la implementación, permitiendo que ambas evolucionen independientemente',
      'Mejora la extensibilidad al permitir extender abstracciones e implementaciones por separado',
      'Oculta detalles de implementación de los clientes, cumpliendo con el principio de encapsulación',
      'Fomenta la aplicación del principio Open/Closed, facilitando la adición de nuevas abstracciones e implementaciones',
      'Introduce un nivel adicional de indirección que puede complicar la comprensión del código',
      'Puede reducir el rendimiento debido a la indirección adicional en las llamadas'
    ],
    
    notes: `
      <h3>¿Cuándo DEBES usar el patrón Bridge?</h3>
      <ul>
        <li><strong>Variación en múltiples dimensiones:</strong> Cuando un componente varía en múltiples dimensiones independientes (por ejemplo, plataformas, bases de datos, renderers, algoritmos).</li>
        <li><strong>Evitar explosión de clases:</strong> Para prevenir la creación de numerosas subclases que resultan de la combinación de diferentes variaciones.</li>
        <li><strong>Intercambio de implementaciones:</strong> Cuando necesitas cambiar la implementación en tiempo de ejecución (por ejemplo, cambiar el motor de renderizado según las capacidades del dispositivo).</li>
        <li><strong>Extensibilidad crítica:</strong> En sistemas donde tanto las abstracciones como las implementaciones deben ser altamente extensibles.</li>
        <li><strong>Separar código específico de plataforma:</strong> Para aislar código dependiente de la plataforma del resto de la aplicación (como drivers, integraciones con APIs externas).</li>
      </ul>
      
      <h3>Variantes del patrón Bridge:</h3>
      <ul>
        <li><strong>Bridge simple:</strong> La implementación clásica con una abstracción conectada a una implementación.</li>
        <li><strong>Bridge con implementación múltiple:</strong> Donde la abstracción utiliza múltiples implementaciones para realizar tareas diferentes.</li>
        <li><strong>Bridge con adaptador:</strong> Combinación de los patrones Bridge y Adapter, donde el adaptador conecta la abstracción con una implementación incompatible.</li>
        <li><strong>Bridge con método plantilla:</strong> Donde la abstracción define un algoritmo y delega pasos específicos a la implementación.</li>
        <li><strong>Bridge con inyección de dependencias:</strong> Utiliza inyección de dependencias para proporcionar implementaciones a las abstracciones.</li>
      </ul>
      
      <h3>Ejemplos prácticos en aplicaciones reales:</h3>
      <ul>
        <li><strong>Frameworks gráficos:</strong> Separar formas (círculo, rectángulo) de cómo se renderizan (vector, raster, 3D), como en Java AWT o Windows GDI.</li>
        <li><strong>Controladores de dispositivos:</strong> Sistemas operativos que separan la API pública del driver de las implementaciones específicas de hardware.</li>
        <li><strong>Frameworks multiplataforma:</strong> Aplicaciones como Electron, React Native o Flutter que separan la interfaz de usuario de las implementaciones específicas de cada plataforma.</li>
        <li><strong>Acceso a bases de datos:</strong> ORMs que separan las operaciones de base de datos (crear, leer, actualizar, eliminar) de los drivers específicos de cada proveedor (MySQL, PostgreSQL, Oracle).</li>
        <li><strong>Sistemas de persistencia:</strong> Separar las operaciones de persistencia (guardar, cargar) de los medios de almacenamiento (archivo, base de datos, nube).</li>
        <li><strong>Servicios de notificación:</strong> Separar la lógica de notificación de los canales de entrega (email, SMS, push).</li>
      </ul>
      
      <h3>Bridge vs Strategy vs Adapter</h3>
      <ul>
        <li><strong>Bridge:</strong> Separa una abstracción de su implementación para que ambas puedan variar independientemente.</li>
        <li><strong>Strategy:</strong> Define una familia de algoritmos intercambiables, pero no necesariamente trata con abstracciones e implementaciones separadas.</li>
        <li><strong>Adapter:</strong> Hace que interfaces incompatibles trabajen juntas, adaptando una interfaz existente, mientras que Bridge diseña la abstracción y la implementación para que funcionen juntas desde el principio.</li>
      </ul>
    `
  }
};

export default bridgePattern;
