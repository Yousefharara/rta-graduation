# توثيق المشروع - RTA Graduation
# Designing with Atomic-design-pattern

---

## فهرس المحتويات

1. [تدفق المستفيد (Beneficiary Flow)](#1-تدفق-المستفيد-beneficiary-flow)
2. [نظام الإشعارات (Notification System)](#2-نظام-الإشعارات-notification-system)
3. [إدارة المساعدات (Aid Orders)](#3-إدارة-المساعدات-aid-orders)
4. [الحملات والتبرعات (Campaigns & Donations)](#4-الحملات-والتبرعات-campaigns--donations)
5. [إدارة المنظمات (Organization Management)](#5-إدارة-المنظمات-organization-management)
6. [الشكاوى (Complaints)](#6-الشكاوى-complaints)
7. [المخزون (Aid Types / Inventory)](#7-المخزون-aid-types--inventory)
8. [المستخدمين (Users Management)](#8-المستخدمين-users-management)
9. [آلية الـ Offline Sync](#9-آلية-الـ-offline-sync)
10. [تدفق المصادقة (Auth Flow)](#10-تدفق-المصادقة-auth-flow)

---

## 1. تدفق المستفيد (Beneficiary Flow)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/components/pages/beneficiary/` | صفحة تقديم طلب المساعدة (public) + تتبع الطلب |
| `src/redux/slices/aidOrdersSlice.ts` | إدارة حالة طلبات المساعدة |
| `src/constants/apiPaths.ts` | نقاط API للمساعدات (`AID_ORDERS`) |

### الأدوار
- **beneficiary** (مستفيد): يقدم طلب مساعدة ويتتبعه
- **donor (guest)**: يقوم بالتصفح في الموقع والتبرع
- **admin / local_org**: يدير الطلبات (قبول / رفض / تجهيز / شحن / توصيل)

### مراحل طلب المساعدة (5 مراحل)

```
 Beneficiary يقدم طلب
        ↓
  1. قيد الانتظار (pending)
        ↓
  (Admin/local_org) يوافق → 2. تمت الموافقة (approved)
        ↓                  
  (Admin/local_org) يجهز  → 3. قيد التجهيز (preparing)
        ↓
  (Admin/local_org) يشحن   → 4. قيد الشحن (shipping)
        ↓
  (Admin/local_org) يسلم   → 5. تم التوصيل (delivered)

  أو في أي مرحلة:
        ↓
  (Admin/local_org) يرفض   → مرفوض (rejected)
```

### التدفق الكامل

#### 1.1 تقديم طلب المساعدة (عام)
```
[مستفيد]
   ↓
يفتح صفحة المساعدات `/`
   ↓
يختار نوع المساعدة ← الكمية
   ↓
يملأ بياناته (الاسم، العنوان، رقم الهاتف، ...)
   ↓
يرسل الطلب → POST /api/aid-orders
   ↓
الطلب يظهر في dashboard الإدارة بحالة "pending"
   ↓
يظهر إشعار للمسؤولين
```

#### 1.2 إدارة الطلب (Dashboard)
```
[Admin / Local Org]
   ↓
يفتح Dashboard ← Aid Orders
   ↓
يرى جدول بجميع الطلبات (حسب الصلاحية)
   ↓
لكل طلب أزرار إجراء:
   ├── قبول (approved)  ← مع Modal تأكيد
   ├── رفض (rejected)   ← مع Modal تأكيد
   ├── تجهيز (preparing)
   ├── شحن (shipping)
   └── توصيل (delivered)
   ↓
عند القبول:
   → يتم خصم الكمية من المخزون (aidTypes)
   → يتغير status إلى "approved"
   → تنشأ إشعارات للمستفيد
عند الرفض:
   → يتم إعادة الكمية للمخزون (إن كانت محجوزة)
   → يتغير status إلى "rejected"
```

### Redux Slice: `aidOrdersSlice`
| Action | الوظيفة |
|--------|---------|
| `fetchAidOrders` | جلب جميع الطلبات (للمسؤول) |
| `createAidOrder` | إنشاء طلب جديد (للمستفيد) |
| `updateAidOrderStatus` | تحديث حالة الطلب (للمسؤول) |

### أنواع حالة الطلب
```typescript
type Status = "pending" | "approved" | "preparing" | "shipping" | "delivered" | "rejected";
```

---

## 2. نظام الإشعارات (Notification System)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/notificationSlice.ts` | إدارة الإشعارات (fetch, read, delete) |
| `src/components/pages/dashboard/notificationsPage/index.tsx` | صفحة عرض الإشعارات |
| `src/components/organisms/sidebar/index.tsx` | عداد الإشعارات غير المقروءة في الـ Sidebar |

### المبادئ
- **الإشعارات تُنشأ من السيرفر** عند حدوث حدث (طلب مساعدة, انشاء شحن ...)
- الـ Frontend **يقرأ فقط** الإشعارات ويغير حالتها (مقروء / غير مقروء) ويحذفها
- لا يوجد إنشاء إشعارات من الـ Frontend مباشرة

### التدفق
```
[Server ينشئ إشعار]
   ↓
API: GET /api/notifications
   ↓
fetchNotifications ← يخزن في Redux
   ↓
يعرض في صفحة Notifications
   ↓
الـ Sidebar يعرض عدد unread
   ↓
[مستخدم يقرأ الإشعار]
   ↓
markAsRead(id) → PUT /api/notifications/:id/read
   ↓
[مستخدم يحذف]
   ↓
deleteNotification(id) ← مع Modal تأكيد
```

### Redux Slice: `notificationSlice`
| Action | الوظيفة |
|--------|---------|
| `fetchNotifications` | جلب كل الإشعارات |
| `markAsRead` | تعيين إشعار كمقروء |
| `deleteNotification` | حذف إشعار |

### ملاحظات التنفيذ
- حذف الإشعار يتم عبر **Modal تأكيد** (أيقونة `Trash2` حمراء)
- العداد في الـ Sidebar يُحسب من `notifications.filter(n => !n.read).length`
- الإشعارات تظهر في صفحة منفصلة (`/dashboard/notifications`)

---

## 3. إدارة المساعدات (Aid Orders)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/components/pages/dashboard/dashbaordAidOrders/` | صفحة إدارة الطلبات |
| `src/redux/slices/aidOrdersSlice.ts` | حالة الطلبات |
| `src/components/pages/trackAidPage/trackAidUser/sections/trackAidUserHero.tsx` | زر إضافة طلب مساعدة في صفحة المستف (التتبع) |

### العرض في Dashboard
- جدول (`TanStack Table`) يعرض جميع طلبات المساعدة
- تصفية حسب الحالة (status filter)
- ترقيم الصفحات

### إضافة طلب من trackAidUserHero.tsx
الضغط على زر اضافة طلب جديد فقط عندما لا يكون لديك مساعدات او المساعدة تم الوصول اوالمساعدة تم الرفض
- اختيار نوع المساعدة
- الوصف

### إجراءات على الطلب
| الإجراء | التأثير |
|---------|---------|
| قبول (`approved`) | خصم الكمية من المخزون |
| رفض (`rejected`) | رفض الطلب |
| تجهيز (`preparing`) | تحديث الحالة فقط |
| شحن (`shipping`) | تحديث الحالة فقط |
| توصيل (`delivered`) | تحديث الحالة فقط |

### أدوات التحكم في الجدول
- أزرار قبول/رفض مع **Modal تأكيد**
- أيقونة `CircleCheck` (أخضر) للقبول، `CircleX` (أحمر) للرفض

---

## 4. الحملات والتبرعات (Campaigns & Donations)

### 4.1 الحملات (Campaigns)

#### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/campaignSlice.ts` | إدارة الحملات |
| `src/@types/campaign.ts` | أنواع `ICampaign`, `ICreateCampaign`, `IEditCampaign` |
| `src/components/pages/dashboard/dashboardCampaigns/` | صفحة إدارة الحملات |
| `src/components/pages/donationPage/index.tsx` | صفحة عرض الحملات للعامة |

#### العمليات (CRUD)
| العملية | الوظيفة |
|---------|---------|
| `fetchCampaigns` | جلب جميع الحملات |
| `createCampaign` | إنشاء حملة جديدة (Admin/local_org) |
| `editCampaign` | تعديل حملة (Admin/local_org) |
| `deleteCampaign` | حذف حملة (Admin/local_org) |

#### نموذج الحملة
```typescript
interface ICreateCampaign {
  title: string;
  description: string;
  start_date: string | null;  // YYYY-MM-DD
  end_date: string | null;    // YYYY-MM-DD
  target_amount: number;
  collected_amount: number;
}
```

#### ملاحظات التنفيذ
- التواريخ تُخزن كنص (`string`) بصيغة `YYYY-MM-DD` بعد إصلاح مشكلة Off-by-one
- التحقق من صحة التواريخ: `end_date >= start_date` (مقارنة useForm)
- `formatDate()`, `toInputDateStr()`, `toDateStr()` في `src/utils/utils.ts` للتعامل مع التواريخ

### 4.2 التبرعات (Donations)

#### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/components/organisms/donationForm/index.tsx` | فورم التبرع |
| `src/redux/slices/donationSlice.ts` | إدارة التبرعات |

#### تدفق التبرع
```
[المتبرع (ضيف)]
[Donor (guest)]
   ↓
يفتح صفحة حملة ← يضغط "تبرع"
   ↓
يختار المبلغ ← إدخال optional email
   ↓
handleOnSubmit → save pendingData (email = null)
   ↓
يظهر Dialog: "لتسجيل تبرعك، يرجى إدخال البريد الإلكتروني"
   ↓
المستخدم يكتب الإيميل ← يضغط "متابعة التبرع"
   ↓
confirmDonation → getValues("email") ← تأخذ الإيميل الحي من الفورم
   ↓
POST /api/donations ← يرسل { guest_email, amount, campaign_id, guest_name(from-card-name) }
```

#### أنواع التبرع
- تبرع لحملة محددة (مع `campaign_id`)

---

## 5. إدارة المنظمات (Organization Management)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/localOrgSlice.ts` | إدارة المنظمات المحلية |
| `src/components/pages/dashboard/dashboardHome/sections/activeOrganizationTable/` | جدول المنظمات النشطة |

### الأدوار
- **local_org**: منظمة محلية تقدم خدمات إغاثة، لها صلاحيات محدودة في الـ Dashboard
- **admin**: يدير المنظمات ويوثقها ولديه كامل الصلاحيات بخلاف اضافة الشحنات لانه ليس لديه الوقت لهذه الامور فيتركها لل local_org

### توثيق المنظمة (Verification)
```
[Local Org تسجل]
   ↓
تظهر في جدول المنظمات النشطة (حالة غير موثقة)
   ↓
[Admin يفتح Dashboard Home]
   ↓
يرى قائمة المنظمات مع زر توثيق (ShieldCheck)
   ↓
يضغط على زر التوثيق
   ↓
يفتح Modal تأكيد: "هل أنت متأكد من توثيق المنظمة {name}؟"
   ↓
يضغط "تأكيد التحقق"
   ↓
PATCH /api/organizations/:id/verify
   ↓
يتم توثيق المنظمة
```

---

## 6. الشكاوى (Complaints)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/complaintSlice.ts` | إدارة الشكاوى |

### العمليات
| العملية | الوظيفة |
|---------|---------|
| `fetchComplaints` | جلب جميع الشكاوى |
| `createComplaint` | تقديم شكوى جديدة |
| `updateComplaintStatus` | تحديث حالة الشكوى |

### التدفق
```
[مستفيد]
   ↓
يقدم شكوى ← POST /api/complaints
   ↓
[Admin]
   ↓
يرى الشكوى في Dashboard
   ↓
يمكنه تحديث حالتها (قيد المراجعة / تم الرد / مغلق)
```

---

## 7. المخزون (Aid Types / Inventory)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/aidSlice.ts` | ادارة المساعدات  |
| `src/components/pages/dashboard/DashboardAids/` |  صفحة إدارة المخزون (المساعدات) |

### العمليات على Aids
| العملية | الوظيفة |
|---------|---------|
| `fetchAids` | جلب جميع أنواع المساعدات |
| `createAid` |  إنشاء مساعدة جديد من خلال المنظمة |
| `editAidDeduct` |  التعديل على عدد المساعدات المتبقى |

### آلية المخزون
```
[local_org ينشئ مساعدة] → quantity = 100
       ↓
[مستفيد يقدم طلب] → الكمية المطلوبة: 1 (default)
       ↓
[Admin/local_org يقبل الطلب]
       ↓
quantity = quantity - 1  ← خصم تلقائي
       ↓
[Admin/local_org يرفض الطلب]
       ↓
 اخبار المستفيد بانه تم الرفض
```


## 8. المستخدمين (Users Management)

### الصفحات والملفات
| الملف | الوظيفة |
|-------|---------|
| `src/redux/slices/usersSlice.ts` | إدارة المستخدمين |
| `src/redux/slices/authSlice.ts` | المصادقة (login, register, logout) |

### المستخدمون في النظام
| النوع | role | صلاحيات |
|-------|------|---------|
| مسؤول | `admin` | كل الصلاحيات (إدارة كل شيء) |
| منظمة محلية | `local_org` | إدارة المستفيدين, ادارة الحملات  (لا يمكنه توثيق المنظمات) |
| مستفيد | `beneficiary` | تقديم طلبات مساعدة، تتبع الطلبات |

### العمليات على المستخدمين (Admin only)
| العملية | الوظيفة |
|---------|---------|
| `fetchUsers` | جلب جميع المستخدمين |
| `deleteUser` | حذف مستخدم |

---

## 9. آلية الـ Offline Sync

### المكونات الأساسية

| الملف | الوظيفة |
|-------|---------|
| `src/lib/syncService.ts` | طابور العمليات في localStorage، المزامنة مع الخادم |
| `src/lib/axiosInterceptors.ts` | اكتشاف أخطاء الشبكة وإضافة العمليات للطابور |
| `src/hooks/useNetworkStatus.ts` | Hook لمراقبة حالة الاتصال (غير مستخدم حالياً) |
| `src/main.tsx` (سطر 9-10) | تشغيل الانترسبتور وآلية المزامنة |
| `vite.config.ts` (سطر 11-48) | إعدادات PWA + Workbox (تخزين مؤقت للاستجابات) |

### تدفق العمل
```
[مستخدم يعمل Create/Update/Delete]
       ↓
axios → Network Error
       ↓
axiosInterceptors.ts يلتقط الخطأ
       ↓
addToQueue() ← يحفظ العملية في localStorage (key: "offline_queue")
       ↓
Toast: "تم حفظ العملية محلياً وستتم مزامنتها تلقائياً عند عودة الإنترنت"
       ↓
[لما الإنترنت يعود]
       ↓
setupAutoSync() → syncNow()
       ↓
POST /api/sync لكل عملية في الطابور
       ↓
حذف العمليات الناجحة من الطابور
```

### ملاحظات
- PWA يستخدم `NetworkFirst` strategy — يحاول من الإنترنت أولاً ثم الكاش
- فقط **auth reducer** هو اللي مستمر عبر `redux-persist` إلى localStorage
- الـ `useNetworkStatus` hook موجود لكن غير مربوط بأي واجهة مستخدم حالياً
- `/api/sync` endpoint لازم يكون موجود عالسيرفر عشان المزامنة تشتغل

---

## 10. تدفق المصادقة (Auth Flow)

### مسارات المصادقة

| المسار | الحماية | الوصف |
|--------|---------|-------|
| `/login` | `GuestGuard` | صفحة الدخول (للمستخدمين غير المسجلين ويمكن اعتبارهم المتبرعين) |
| `/dashboard/*` | `AdminGuard` | لوحة التحكم (لـ admin و local_org فقط) |
| `/track-aid/auth` | `UserGuard` | تتبع المساعدات (للمستفيد المسجل) |
| `/`, `/about`, `/contactus`, `/track-aid` | عامة | صفحات خارجية لا تحتاج توثيق |

### إدارة التوكن
- التطبيق **لا يملك axios interceptor عام** لإضافة Bearer token
- كل `action` يقرأ `accessToken` من Redux ويمرره يدوياً:
  ```typescript
  const { accessToken } = useAppSelector((state) => state.auth);
  dispatch(someAction(body, accessToken || ""));
  ```
- الـ auth state مستمر عبر `redux-persist` إلى localStorage (whitelist: user, accessToken, role, ...)

### Session Timeout
- الملف: `src/components/organisms/sessionTimeoutManager/SessionTimeoutManager.tsx`
- مدة الجلسة: 13 دقيقة
- تحذير قبل الدقيقة الأخيرة مع عد تنازلي
- يمكن تجديد الجلسة عبر `/api/auth/refresh-token`

### الحماية
- **GuestGuard**: إذا كان المستخدم مسجلاً (admin/local_org → /dashboard، beneficiary → /track-aid/auth)
- **AdminGuard**: يفحص `allowedRoles` (مثلاً `["admin", "local_org"]`)، وإلا redirect إلى `/login`
- **UserGuard**: يتحقق من أن role = `beneficiary`

---

## هيكل المشروع (المجلدات الرئيسية)

```
src/
├── @types/               # TypeScript interfaces
├── assets/               # صور وأصول ثابتة
├── components/
│   ├── atoms/            # مكونات صغيرة (Button, Input, Spinner)
│   ├── molecules/        # مكونات مركبة (RowForm)
│   ├── organisms/        # مكونات متكاملة (Navbar, Sidebar, forms)
│   ├── pages/            # صفحات الموقع
│   └── templates/        # القوالب (LayoutTemplate, DashboardTemplate)
├── config/               # الإعدادات (api.ts)
├── constants/            # الثوابت (apiPaths.ts, roles.ts)
├── guards/               # حراس المسارات (AdminGuard, GuestGuard, UserGuard)
├── hooks/                # React hooks مخصصة
├── lib/                  # مكتبات مساعدة (syncService, axiosInterceptors)
├── redux/
│   ├── slices/           # Redux slices لكل كيان
│   ├── rooteReducer.ts   # دمج الـ reducers مع persist config
│   └── store.tsx         # إعداد Redux store + persistor
├── routes/               # تعريف المسارات (routes.tsx, paths.ts)
└── utils/                # دوال مساعدة (formatDate, utils)
```

---

## أدوات وتقنيات المشروع

- **React 19** + **TypeScript 5.9**
- **Vite 7** (build tool)
- **Redux Toolkit** + **redux-persist** (state management)
- **React Router v7** (routing)
- **react-hook-form** + **Yup** (forms + validation)
- **TanStack React Table** (tables)
- **Axios** (HTTP client)
- **Tailwind CSS 4** (styling)
- **Lucide React** (icons)
- **Sonner** (toast notifications)
- **vite-plugin-pwa** + **Workbox** (PWA + offline caching)
- **json-server** (mock API للتطوير) لكن تم حذفه

---