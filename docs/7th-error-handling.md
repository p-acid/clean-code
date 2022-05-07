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
    try {
      FileInputStream stream = new FileInputStream(sectionName);
      stream.close();
    } catch (FileNotFoundException e) {
      throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
  }
```
