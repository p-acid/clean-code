---
sidebar_position: 6
---

# 7장. 오류 처리

<br/>

## 들어가며

---

오류 처리는 프로그램에 반드시 필요한 요소 중 하나일 것이며, 오류 처리 코드로 인해 프로그램 로직을 이해하기 어려워진다면 깨끗한 코드라 부르기 어렵다.

<br/>

### 오류 코드보다 예외를 사용하라

---

예전 프로그래밍 언어들은 예외를 제공하지 않았고, 이 경우 오류 처리와 보고 방법에서 제한적이었다.

```java
// Bad
public class DeviceController {
  ...
  public void sendShutDown() {
    DeviceHandle handle = getHandle(DEV1);
    // 디바이스 상태를 점검한다.
    if (handle != DeviceHandle.INVALID) {
      // 레코드 필드에 디바이스 상태를 저장한다.
      retrieveDeviceRecord(handle);
      // 디바이스가 일시정지 상태가 아니면 종료한다.
      if (record.getStatus() != DEVICE_SUSPENDED) {
        pauseDevice(handle);
        clearDeviceWorkQueue(handle);
        closeDevice(handle);
      } else {
        logger.log("Device suspended. Unable to shut down");
      }
    } else {
      logger.log("Invalid handle for: " + DEV1.toString());
    }
  }
  ...
}
```

위 경우 함수 호출 즉시 오류를 확인해야 하기에, 호출자 코드가 복잡해진다.

- 불행히도 이 단계는 잊어버리기 쉬우며, 그렇기에 예외를 던지는 편이 더 낫다.

```java
// Good
public class DeviceController {
  ...
  public void sendShutDown() {
    try {
      tryToShutDown();
    } catch (DeviceShutDownError e) {
      logger.log(e);
    }
  }

  private void tryToShutDown() throws DeviceShutDownError {
    DeviceHandle handle = getHandle(DEV1);
    DeviceRecord record = retrieveDeviceRecord(handle);
    pauseDevice(handle);
    clearDeviceWorkQueue(handle);
    closeDevice(handle);
  }

  private DeviceHandle getHandle(DeviceID id) {
    ...
    throw new DeviceShutDownError("Invalid handle for: " + id.toString());
    ...
  }
  ...
}
```

디바이스 종료 알고리즘과 오류 처리 알고리즘이 분리되어 코드 품질도 나아지고 깨끗해졌다.

<br/>

## Try-Catch-Finally 문부터 작성해라

---

- `try` 블록은 트랜잭션과 비슷하며, `try` 블록에서 뭐가 일어나든 `catch` 블록은 프로그램 상태를 일관성 있게 유지해야 한다.

```java
// Step 1: StorageException을 던지지 않으므로 이 테스트는 실패한다.

@Test(expected = StorageException.class)
    public void retrieveSectionShouldThrowOnInvalidFileName() {
    sectionStore.retrieveSection("invalid - file");
}

public List<RecordedGrip> retrieveSection(String sectionName) {
    // dummy return until we have a real implementation
    return new ArrayList<RecordedGrip>();
}
```

```java
// Step 2: 이제 테스트는 통과한다.
public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
        FileInputStream stream = new FileInputStream(sectionName)
    } catch (Exception e) {
        throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
}
```

```java
// Step 3: Exception의 범위를 FileNotFoundException으로 줄여 정확히 어떤 Exception이 발생한지 체크하자.
public List<RecordedGrip> retrieveSection(String sectionName) {
    try {ß
        FileInputStream stream = new FileInputStream(sectionName);
        stream.close();
    } catch (FileNotFoundException e) {
        throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
}
```

<br/>

## 미확인(unchecked) 예외를 사용하라

---

확인된 예외의 장단점에 대한 논쟁은 **안정적인 소프트웨어를 제작하는 요소로 확인된 예외가 반드시 필요하지는 않다**라고 결정났다.

- 확인된 오류의 비용에 상응하는 이익을 제공하는 지를 따져보면 된다.
- 확인된 예외는 OCP(Open Closed Principle)를 위반한다.
  - 메서드에서 확인된 예외를 던지는데 `catch` 블록이 세 단계 위에 있다면, 그 사이 메서드 모두가 선언부에 예외를 정의해야 한다.
    - 즉, 하위 단계에서 코드를 변경하면 상위 단계 메서드 선언부를 전부 고쳐야 한다는 말이다.
  - 단계별 함수가 있을 때, 최하위 함수에 `throws` 절을 추가하면 변경한 함수를 호출하는 모든 함수가 `catch` 블록에서 새로운 예외를 처리하거나, 선언부에 `throw` 절을 추가해야 한다는 것이다.

결과적으로 **최하위부터 최상위까지 연쇄적인 수정을 야기하고, 캡슐화를 깨버린다**는 단점이 있다.

> 때로는 아주 중요한 라이브러리를 작성할 때 확인된 예외는 유용할 수 있다. 그렇지만 일반적인 애플리케이션은 **의존성이라는 비용이 이익보다 크다.**

<br/>

## 예외에 의미를 제공하라

---

예외를 던질 때 전후 상황을 충분히 덧붙이면 오류가 발생한 원인과 위치를 찾기가 쉬워진다.

- 오류 메시지에 정보를 담아 예외와 함께 던지고 실패한 연산 이름과 실패 유형도 언급한다.

<br/>

## 호출자를 고려해 예외 클래스를 정의하라

---

오류를 분류하는 방법은 수없이 많다. 우선 **오류가 발생한 위치**로 분류가 가능하다.

- 예를 들어, **오류가 발생한 컴포넌트**로 분류하거나 **유형**으로 분류가 가능하다.

중요한 점은 애플리케이션에서 오류를 정의할 때 **오류를 잡아내는 방법**이 되어야 한다는 점이다.

- 써드파티 라이브러리를 사용하는 경우 그것들을 래핑함으로써
  - 라이브러리 교체 등의 변경이 있는 경우 대응하기 쉬워진다.
  - 라이브러리를 쓰는 곳을 테스트할 경우 해당 라이브러리를 가짜로 만들거나 함으로써 테스트하기 쉬워진다.
  - 라이브러리의 api 디자인에 종속적이지 않고 내 입맛에 맞는 디자인을 적용할 수 있다.

```java
// Bad
// catch문의 내용이 거의 같다.

ACMEPort port = new ACMEPort(12);

try {
    port.open();
} catch (DeviceResponseException e) {
    reportPortError(e);
    logger.log("Device response exception", e);
} catch (ATM1212UnlockedException e) {
    reportPortError(e);
    logger.log("Unlock exception", e);
} catch (GMXError e) {
    reportPortError(e);
    logger.log("Device response exception");
} finally {
    ...
}
```

```java
  // Good
  // ACME 클래스를 LocalPort 클래스로 래핑해 new ACMEPort().open() 메소드에서 던질 수 있는 exception들을 간략화

LocalPort port = new LocalPort(12);

try {
    port.open();
} catch (PortDeviceFailure e) {
    reportError(e);
    logger.log(e.getMessage(), e);
} finally {
    ...
}

public class LocalPort {
    private ACMEPort innerPort;
    public LocalPort(int portNumber) {
        innerPort = new ACMEPort(portNumber);
    }

    public void open() {
        try {
        innerPort.open();
        } catch (DeviceResponseException e) {
        throw new PortDeviceFailure(e);
        } catch (ATM1212UnlockedException e) {
        throw new PortDeviceFailure(e);
        } catch (GMXError e) {
        throw new PortDeviceFailure(e);
        }
    }
    ...
}
```

> 이해와 공감이 어려운 부분이다...

<br/>

## 정상 흐름을 정의하라

---

예외가 논리를 따라가기 어려운 경우 클래스를 만들거나 객체를 조작하는 **특수 사례 패턴(Special Case Pattern)**을 활용하는 방식이 있다.

```java
// Bad

try {
    MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
    m_total += expenses.getTotal();
} catch(MealExpensesNotFound e) {
    m_total += getMealPerDiem();
}
```

```java
// Good

// caller logic.
...
MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
m_total += expenses.getTotal();
...

public class PerDiemMealExpenses implements MealExpenses {

    public int getTotal() {
        // return the per diem default
    }
}

// 이해를 돕기 위해 직접 추가한 클래스
public class ExpenseReportDAO {
...
    public MealExpenses getMeals(int employeeId) {
        MealExpenses expenses;

        try {
            expenses = expenseReportDAO.getMeals(employee.getID());
        } catch(MealExpensesNotFound e) {
            expenses = new PerDiemMealExpenses();
        }

        return expenses;
    }
    ...
}
```

이렇게 되면 [**클라이언트 코드**](https://freesugar.tistory.com/64)가 예외적인 상황을 처리할 필요가 없어진다.

<br/>

## null을 반환하지 마라

---

`null` 체킹 자체가 많은 것도 문제다.

- 메서드에서 `null` 을 리턴하고 싶어진다면 특수 사례 객체를 반환하자.
- 써드파티 라이브러리에서 `null` 을 리턴할 가능성이 있는 메서드가 있다면 예외를 던지거나 특수 사례 객체를 리턴하는 매서드로 래핑하라.

```java
// BAD!!!!
public void registerItem(Item item) {
  if (item != null) {
    ItemRegistry registry = peristentStore.getItemRegistry();
    if (registry != null) {
      Item existing = registry.getItem(item.getID());
      if (existing.getBillingPeriod().hasRetailOwner()) {
        existing.register(item);
      }
    }
  }
}


// 위 peristentStore가 null인 경우에 대한 예외처리가 안된 것을 눈치챘는가?
// 만약 여기서 NullPointerException이 발생했다면 수십단계 위의 메소드에서 처리해줘야 하나?
// 이 메소드의 문제점은 null 체크가 부족한게 아니라 null체크가 너무 많다는 것이다.
```

```java
//  Bad 2
List<Employee> employees = getEmployees();
if (employees != null) {
  for(Employee e : employees) {
    totalPay += e.getPay();
  }
}
```

```java
// Good
List<Employee> employees = getEmployees();
for(Employee e : employees) {
  totalPay += e.getPay();
}

public List<Employee> getEmployees() {
  if( .. there are no employees .. )
    return Collections.emptyList();
}
```

<br/>

## null을 전달하지 마라

---

정상적인 인수로 `null` 을 기대하는 API가 아니라면 메서드로 `null` 을 전달하지 말자.

- 가장 이상적인 해법은 **`null` 을 파라미터로 받지 못하게 하는 것**이다.

```java
// Bad
// calculator.xProjection(null, new Point(12, 13));
// 위와 같이 부를 경우 NullPointerException 발생
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    return (p2.x – p1.x) * 1.5;
  }
  ...
}

// Bad
// NullPointerException은 안나지만 윗단계에서 InvalidArgumentException이 발생할 경우 처리해줘야 함.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    if(p1 == null || p2 == null){
      throw InvalidArgumentException("Invalid argument for MetricsCalculator.xProjection");
    }
    return (p2.x – p1.x) * 1.5;
  }
}

// Bad
// 좋은 명세이지만 첫번째 예시와 같이 NullPointerException 문제를 해결하지 못한다.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    assert p1 != null : "p1 should not be null";
    assert p2 != null : "p2 should not be null";

    return (p2.x – p1.x) * 1.5;
  }
}
```

<br/>

## 결론

---

깨끗한 코드는 읽기 쉬움과 동시에 **안정성**이 있어야 한다.

- 이 둘은 상충하는 목표가 아니다.
- 오류 처리를 프로그램 논리와 분리해 독자적인 사안으로 고려한다면 튼튼하고 깨끗한 코드를 만들 수 있다.
- 오류 처리를 프로그램 논리와 분리하면 독립적인 추론이 가능해지고, 코드 유지 보수성도 좋아진다.
