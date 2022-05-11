---
sidebar_position: 10
---

# 10장. 클래스

<br/>

## 들어가며

---

코드의 표현력과 그 코드로 이루어진 함수에 아무리 신경 쓸지라도 좀 더 차원 높은 단계까지 신경 쓰지 않으면 깨끗한 코드를 얻기 어렵다.

해당 장에서는 **깨끗한 클래스**를 다룬다.

<br/>

## 클래스 체계

---

클래스를 정의하는 표준 자바 관례에 따르면 가장 먼저 **변수 목록**이 나오며 순서는 다음과 같다.

- `static public`
- `static private`
- `private` 인스턴스
- `public` 은 필요한 경우가 거의 없다.

변수 목록 다음엔 **공개 함수**가 나오고, **비공개 함수**는 자신을 호출하는 공개 함수 직후에 나온다.

즉, 추상화 단계가 순차적으로 내려간다.

<br/>

### 캡슐화

---

변수와 유틸리티 함수는 가능한 공개하지 않는 편이 낫지만 반드시 숨겨야 하는 것은 아니다.

- 때로는 변수나 유틸리티 함수를 `protected` 로 선언해 테스트 코드에 접근을 허용하기도 한다.
- 하지만 비공개 상태를 유지할 온갖 방법을 강구해야 하고, 캡슐화를 풀어주는 결정은 언제나 최후의 수단이다.

<br/>

## 클래스는 작아야 한다

---

클래스를 만들 때 첫 번째 규칙은 **크기**이며, 클래스는 **작아야 한다.**

> 두 번째 규칙도 크기다. 더 작아야 한다.

함수의 경우 물리적인 행 수로 크기를 측정했지만, 클래스는 **책임**을 센다.

```java
// 어마어마하게 큰 슈퍼 만능 클래스

public class SuperDashboard extends JFrame implements MetaDataUser {
	public String getCustomizerLanguagePath()
	public void setSystemConfigPath(String systemConfigPath)
	public String getSystemConfigDocument()
	public void setSystemConfigDocument(String systemConfigDocument)
	public boolean getGuruState()
	public boolean getNoviceState()
	public boolean getOpenSourceState()
	public void showObject(MetaObject object)
	public void showProgress(String s)
	public boolean isMetadataDirty()
	public void setIsMetadataDirty(boolean isMetadataDirty)
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public void setMouseSelectState(boolean isMouseSelected)
	public boolean isMouseSelected()
	public LanguageManager getLanguageManager()
	public Project getProject()
	public Project getFirstProject()
	public Project getLastProject()
	public String getNewProjectName()
	public void setComponentSizes(Dimension dim)
	public String getCurrentDir()
	public void setCurrentDir(String newDir)
	public void updateStatus(int dotPos, int markPos)
	public Class[] getDataBaseClasses()
	public MetadataFeeder getMetadataFeeder()
	public void addProject(Project project)
	public boolean setCurrentProject(Project project)
	public boolean removeProject(Project project)
	public MetaProjectHeader getProgramMetadata()
	public void resetDashboard()
	public Project loadProject(String fileName, String projectName)
	public void setCanSaveMetadata(boolean canSave)
	public MetaObject getSelectedObject()
	public void deselectObjects()
	public void setProject(Project project)
	public void editorAction(String actionName, ActionEvent event)
	public void setMode(int mode)
	public FileManager getFileManager()
	public void setFileManager(FileManager fileManager)
	public ConfigManager getConfigManager()
	public void setConfigManager(ConfigManager configManager)
	public ClassLoader getClassLoader()
	public void setClassLoader(ClassLoader classLoader)
	public Properties getProps()
	public String getUserHome()
	public String getBaseDir()
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber()
	public MetaObject pasting(MetaObject target, MetaObject pasted, MetaProject project)
	public void processMenuItems(MetaObject metaObject)
	public void processMenuSeparators(MetaObject metaObject)
	public void processTabPages(MetaObject metaObject)
	public void processPlacement(MetaObject object)
	public void processCreateLayout(MetaObject object)
	public void updateDisplayLayer(MetaObject object, int layerIndex)
	public void propertyEditedRepaint(MetaObject object)
	public void processDeleteObject(MetaObject object)
	public boolean getAttachedToDesigner()
	public void processProjectChangedState(boolean hasProjectChanged)
	public void processObjectNameChanged(MetaObject object)
	public void runProject()
	public void setAçowDragging(boolean allowDragging)
	public boolean allowDragging()
	public boolean isCustomizing()
	public void setTitle(String title)
	public IdeMenuBar getIdeMenuBar()
	public void showHelper(MetaObject metaObject, String propertyName)

	// ... many non-public methods follow ...
}
```

```java
// 메소드를 5개로 줄인다고 하더라도 여전히 책임이 많다..

public class SuperDashboard extends JFrame implements MetaDataUser {
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber()
}
```

앞의 코드를 줄여서 메서드 다섯 개로 줄였지만 여기선 아직도 **책임이 많다.**

- 클래스 이름은 **클래스의 책임을 기술**해야 한다.
  - 작명은 클래스 크기를 줄이는 첫 번째 관문이다.
- 또한, 클래스 설명은 `if`, `and`, `or`, `but` 을 사용하지 않고서 25단어 내외로 가능해야 한다.

<br/>

### 단일 책임 원칙

---

**단일 책임 원칙(Single Responsibility Principle, 이하 SRP)**은 클래스나 모듈을 변경할 **이유가 단 하나**뿐이어야 한다는 원칙이다.

```java
// 이 코드는 작아보이지만, 변경할 이유가 2가지이다.
// 첫째, SuperDashboard는 소프트웨어 버전 정보를 추적한다. 버전 정보는 소프트웨어 출시마다 달라지는데 말이다.
// 둘째, SuperDashboard는 자바 스윙 컴포넌트를 관리한다. 스윙 코드를 변경할 때마다 버전 번호가 바뀐다.

public class SuperDashboard extends JFrame implements MetaDataUser {
	public Component getLastFocusedComponent()
	public void setLastFocused(Component lastFocused)
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber()
}
```

책임, 즉 변경할 이유를 파악하려 애쓰다 보면 코드를 추상화하기도 쉬워진다.

```java
// 위 코드에서 버전 정보를 다루는 메서드 3개를 따로 빼서
// Version이라는 독자적인 클래스를 만들어 다른 곳에서 재사용하기 쉬워졌다.

public class Version {
	public int getMajorVersionNumber()
	public int getMinorVersionNumber()
	public int getBuildNumber()
}
```

SRP는 객체지향설계에서 더욱 중요한 개념이고, 지키기 수월한 개념인데, 개발자가 가장 무시하는 규칙 중 하나이다.

- 대부분의 프로그래머들이 돌아가는 소프트웨어에 초점을 맞춘다.
  - 전적으로 올바른 태도이기는 하지만, 돌아가는 소프트웨어가 작성되면 깨끗하고 체계적인 소프트웨어라는 다음 관심사로 전환을 해야한다.

작은 클래스가 많은 시스템이든, 큰 클래스가 몇 개뿐인 시스템이든 돌아가는 부품은 그 수가 비슷하다.

> "도구 상자를 어떻게 관리하고 싶은가? <br/> 작은 서랍을 많이 두고 기능과 이름이 명확한 컴포넌트를 나눠 넣고 싶은가? <br/> 아니면 큰 서랍 몇개를 두고 모두 던져 넣고 싶은가?"

큰 클래스 몇개가 아니라 작은 클래스 여럿으로 이뤄진 시스템이 더 바람직하다.

- 작은 클래스는 각자 맡은 책임이 하나며, 변경할 이유가 하나며, 다른 작은 클래스와 협력해 시스템에 필요한 동작을 수행한다.

## 응집도

---

클래스는 **인스턴스 변수 수가 작아야 한다.**

- 각 클래스 메서드는 클래스 인스턴스 변수를 하나 이상 사용해야 한다.
- 일반적으로 메서드가 변수를 더 많이 사용할 수록 메서드와 클래스는 응집도가 더 높다.
  - 모든 인스턴스 변수를 메서드마다 사용하는 클래스는 응집도가 가장 높지만, 이런 클래스는 가능하지도, 바람직하지도 않다.
  - 하지만 가능한 **응집도가 높은 클래스를 지향**해야 한다.

응집도가 높다는 말은 **클래스에 속한 메서드와 변수가 서로 의존하며 논리적인 단위로 묶인다**는 의미기 때문이다

```java
// Stack을 구현한 코드, 응집도가 높은 편이다.

public class Stack {
	private int topOfStack = 0;
	List<Integer> elements = new LinkedList<Integer>();

	public int size() {
		return topOfStack;
	}

	public void push(int element) {
		topOfStack++;
		elements.add(element);
	}

	public int pop() throws PoppedWhenEmpty {
		if (topOfStack == 0)
			throw new PoppedWhenEmpty();
		int element = elements.get(--topOfStack);
		elements.remove(topOfStack);
		return element;
	}
}
```

<br/>

## 응집도

---
