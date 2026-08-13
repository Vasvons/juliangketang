const http = require('http');

let userToken = '';
let adminToken = '';
let courseId = 1;
let categoryId = 1;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (err) {
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

function assertSuccess(res) {
  return res.statusCode >= 200 && res.statusCode < 300 && res.data && (res.data.code === 0 || res.data.code === 200);
}

function printResult(name, success, extra = '') {
  const status = success ? '✅ 通过' : '❌ 失败';
  console.log(`${status} - ${name}${extra ? ` (${extra})` : ''}`);
}

async function runTests() {
  console.log('开始接口测试...\n');

  // 1. GET /api/home
  {
    const res = await request('GET', '/api/home');
    const ok = assertSuccess(res);
    printResult('GET /api/home', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 2. GET /api/categories
  {
    const res = await request('GET', '/api/categories');
    const ok = assertSuccess(res);
    printResult('GET /api/categories', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
    if (ok && Array.isArray(res.data.data) && res.data.data.length > 0) {
      categoryId = res.data.data[0].id;
    }
  }

  // 3. GET /api/categories/:id/courses
  {
    const res = await request('GET', `/api/categories/${categoryId}/courses`);
    const ok = assertSuccess(res);
    printResult(`GET /api/categories/${categoryId}/courses`, ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 4. GET /api/courses/:id
  {
    const res = await request('GET', `/api/courses/${courseId}`);
    const ok = assertSuccess(res);
    printResult(`GET /api/courses/${courseId}`, ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 5. GET /api/config/page-configs
  {
    const res = await request('GET', '/api/config/page-configs');
    const ok = assertSuccess(res);
    printResult('GET /api/config/page-configs', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 6. POST /api/auth/login (mock 模式)
  {
    const res = await request('POST', '/api/auth/login', { code: 'mock_code', userInfo: { nickName: 'Tester' } });
    const ok = assertSuccess(res) && res.data.data && res.data.data.token;
    printResult('POST /api/auth/login (mock)', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
    if (ok) {
      userToken = res.data.data.token;
    }
  }

  // 7. GET /api/user/info
  {
    const res = await request('GET', '/api/user/info', null, userToken);
    const ok = assertSuccess(res);
    printResult('GET /api/user/info', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 8. POST /api/activation/activate
  {
    const codeCandidates = ['VIP-2024-001', 'VIP-2024-002', 'VIP-2024-003', 'VIP-2024-004', 'VIP-2024-005'];
    let activatedCode = '';
    let ok = false;
    for (const code of codeCandidates) {
      const res = await request('POST', '/api/activation/activate', { code }, userToken);
      if (assertSuccess(res)) {
        activatedCode = code;
        ok = true;
        break;
      }
    }
    printResult('POST /api/activation/activate', ok, activatedCode ? `code: ${activatedCode}` : '所有种子卡密均已被使用');
    if (!ok) console.log('  响应: 未找到可用卡密');
  }

  // 9. POST /api/courses/:id/resource
  {
    const res = await request('POST', `/api/courses/${courseId}/resource`, {}, userToken);
    const ok = assertSuccess(res);
    printResult(`POST /api/courses/${courseId}/resource`, ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 10. POST /api/admin/auth/login
  {
    const res = await request('POST', '/api/admin/auth/login', { username: 'admin', password: '123456' });
    const ok = assertSuccess(res) && res.data.data && res.data.data.token;
    printResult('POST /api/admin/auth/login', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
    if (ok) {
      adminToken = res.data.data.token;
    }
  }

  // 11. GET /api/admin/banners
  {
    const res = await request('GET', '/api/admin/banners', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/banners', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 12. GET /api/admin/notices
  {
    const res = await request('GET', '/api/admin/notices', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/notices', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 13. GET /api/admin/categories
  {
    const res = await request('GET', '/api/admin/categories', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/categories', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 14. GET /api/admin/courses
  {
    const res = await request('GET', '/api/admin/courses', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/courses', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 15. GET /api/admin/levels
  {
    const res = await request('GET', '/api/admin/levels', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/levels', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 16. GET /api/admin/activation-codes
  {
    const res = await request('GET', '/api/admin/activation-codes', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/activation-codes', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  // 17. GET /api/admin/page-configs
  {
    const res = await request('GET', '/api/admin/page-configs', null, adminToken);
    const ok = assertSuccess(res);
    printResult('GET /api/admin/page-configs', ok);
    if (!ok) console.log('  响应:', JSON.stringify(res.data));
  }

  console.log('\n接口测试完成');
}

runTests().catch((err) => {
  console.error('测试脚本执行出错:', err);
  process.exit(1);
});
