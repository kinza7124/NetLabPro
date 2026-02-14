const CACHE_NAME = "netlabpro-offline-v1";
const RUNTIME_CACHE = "netlabpro-runtime";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/Netplay.html",
  "/about.html",
  "/contact.html",
  "/privacy-policy.html",
  "/terms.html",
  "/lab1.html",
  "/lab2.html",
  "/lab3.html",
  "/lab4.html",
  "/lab5.html",
  "/lab6A.html",
  "/lab6B.html",
  "/lab7.html",
  "/lab8.html",
  "/lab9.html",
  "/lab10.html",
  "/lab11.html",
  "/offline.html",
  "/style.css",
  "/manifest.json",
  "/ads.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/images/logo2.png",
  "/images/OSImodel.jpg",
  "/images/OSI_Advanced.jpg",
  "/images/Tcp_congestion_control.jpg",
  "/images/Wireshark_img.png",
  "/images/lab4ss1.jpg",
  "/images/lab4ss2.jpg",
  "/images/lab4ss3.jpg",
  "/images/lab4ss4.jpg",
  "/images/lab4ss5.jpg",
  "/images/lab4ss6.jpg",
  "/images/lab4ss6%20(2).jpg",
  "/images/lab4ss7.jpg",
  "/images/lab4ss8.jpg",
  "/images/lab4ss9.jpg",
  "/images/lab4ss10.jpg",
  "/images/lab4ss11.jpg",
  "/images/lab4ss12.jpg",
  "/images/lab4ss13.jpg",
  "/images/lab4ss14.jpg",
  "/images/lab4ss15.jpg",
  "/images/lab4ss16.jpg",
  "/images/lab4ss17.jpg",
  "/images/lab4ss18.jpg",
  "/images/lab4ss19.jpg",
  "/images/lab4ss20.jpg",
  "/images/lab4ss21.jpg",
  "/images/lab5ss1.jpg",
  "/images/lab5ss2.jpg",
  "/images/lab5ss3.jpg",
  "/images/lab5ss4.jpg",
  "/images/lab5ss5.jpg",
  "/images/lab5ss6.jpg",
  "/images/lab5ss7.jpg",
  "/images/lab5ss8.jpg",
  "/images/lab5ss9.jpg",
  "/images/lab5ss10.jpg",
  "/images/lab5ss11.jpg",
  "/images/lab5ss12.jpg",
  "/images/lab5ss13.jpg",
  "/images/lab6a_1.jpg",
  "/images/lab6a_2.jpg",
  "/images/lab6a_3.jpg",
  "/images/lab6a_4.jpg",
  "/images/lab6a_5.jpg",
  "/images/lab6a_6.jpg",
  "/images/lab6a_7.jpg",
  "/images/lab6a_8.jpg",
  "/images/lab6a_9.jpg",
  "/images/lab6a_10.jpg",
  "/images/sshswitch_1.jpg",
  "/images/sshswitch_2.jpg",
  "/images/sshswitch_3.jpg",
  "/images/sshswitch_4.jpg",
  "/images/sshswitch_5.jpg",
  "/images/sshswitch_6.jpg",
  "/images/sshrouter_1.jpg",
  "/images/sshrouter_2.jpg",
  "/images/sshrouter_3.jpg",
  "/images/sshrouter_4.jpg",
  "/images/FTP_1.jpg",
  "/images/FTP_2.jpg",
  "/images/FTP_3.jpg",
  "/images/FTP_4.jpg",
  "/images/FTP_5.jpg",
  "/images/FTP_6.jpg",
  "/images/FTP_7.jpg",
  "/images/FTP_8.jpg",
  "/pdfs/ACL.pdf",
  "/pdfs/APPLYING_TELNET,SSH.pdf",
  "/pdfs/DHCP.pdf",
  "/pdfs/Edited_Lab_1_Task.pdf",
  "/pdfs/Lab7_Task.pdf",
  "/pdfs/Lab_01_Task_23k-0842.pdf",
  "/pdfs/Lab_02_Task.pdf",
  "/pdfs/Lab_03_Task.pdf",
  "/pdfs/Lab_4_Task.pdf",
  "/pdfs/Lab_5_Task.pdf",
  "/pdfs/Lab_6_Task.pdf",
  "/pdfs/TELNET&SSH.pdf",
  "/pdfs/k230842%20Kinza%20Afzal%20-%20Lab%2010%20Task.pdf",
  "/pdfs/k230842%20Kinza%20Afzal%20-%20Lab%2011%20Task.pdf",
  "/pdfs/k230842%20Kinza%20Afzal%20-%20Lab%208%20Task.pdf",
  "/pdfs/k230842%20Kinza%20Afzal%20-%20Lab%209%20Task%20(1).pdf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const requests = PRECACHE_URLS.map((url) => new Request(encodeURI(url), { cache: "reload" }));
      return cache.addAll(requests);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => cached);
    })
  );
});
