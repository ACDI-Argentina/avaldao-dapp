import User from './User';

// Test User model
describe('User Model', () => {
  const TestUserData = {
    address: '0x0',
    avatar: 'test',
    commitTime: '2018-03-03',
    email: 'test@test.te',
    giverId: '0',
    url: 'https://join.giveth.io',
    name: 'John Doe',
  };
  const TestUserData2 = {
    address: '0x01',
    avatar: 'test2',
    commitTime: '2018-03-04',
    email: 'test2@test.te',
    giverId: 1,
    url: 'https://join.giveth.io/',
    name: 'Doe John',
  };
  const TestUserDataWrong = {
    address: 1241,
    avatar: 512,
    commitTime: {},
    email: () => {},
    giverId: {},
    url: 421,
    name: 432,
  };
  const TestUser = new User(TestUserData);

  it('should have correct address', () => {
    expect(TestUser.address).toBe(TestUserData.address);
  });

  it('should have correct avatar', () => {
    expect(TestUser.avatar).toBe(TestUserData.avatar);
  });

  it('should have correct commitTime', () => {
    expect(TestUser.commitTime).toBe(TestUserData.commitTime);
  });

  it('should have correct email', () => {
    expect(TestUser.email).toBe(TestUserData.email);
  });

  it('should have correct giverId', () => {
    expect(TestUser.giverId).toBe(TestUserData.giverId);
  });

  it('should have correct url', () => {
    expect(TestUser.url).toBe(TestUserData.url);
  });

  it('should have correct name', () => {
    expect(TestUser.name).toBe(TestUserData.name);
  });

  it('should have correct address after reassigning', () => {
    TestUser.address = TestUserData2.address;
    expect(TestUser.address).toBe(TestUserData2.address);
  });

  it('should have correct avatar after reassigning', () => {
    TestUser.avatar = TestUserData2.avatar;
    expect(TestUser.avatar).toBe(TestUserData2.avatar);
  });

  it('should have correct commitTime after reassigning', () => {
    TestUser.commitTime = TestUserData2.commitTime;
    expect(TestUser.commitTime).toBe(TestUserData2.commitTime);
  });

  it('should have correct email after reassigning', () => {
    TestUser.email = TestUserData2.email;
    expect(TestUser.email).toBe(TestUserData2.email);
  });

  it('should have correct giverId after reassigning', () => {
    TestUser.giverId = TestUserData2.giverId;
    expect(TestUser.giverId).toBe(TestUserData2.giverId);
  });

  it('should have correct url after reassigning', () => {
    TestUser.url = TestUserData2.url;
    expect(TestUser.url).toBe(TestUserData2.url);
  });

  it('should have correct name after reassigning', () => {
    TestUser.name = TestUserData2.name;
    expect(TestUser.name).toBe(TestUserData2.name);
  });

  it('should throw TypeError on wrong address type', () => {
    expect(() => {
      TestUser.address = TestUserDataWrong.address;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong avatar type', () => {
    expect(() => {
      TestUser.avatar = TestUserDataWrong.avatar;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong commitTime type', () => {
    expect(() => {
      TestUser.commitTime = TestUserDataWrong.commitTime;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong email type', () => {
    expect(() => {
      TestUser.email = TestUserDataWrong.email;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong giverId type', () => {
    expect(() => {
      TestUser.giverId = TestUserDataWrong.giverId;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong url type', () => {
    expect(() => {
      TestUser.url = TestUserDataWrong.url;
    }).toThrow(TypeError);
  });

  it('should throw TypeError on wrong name type', () => {
    expect(() => {
      TestUser.name = TestUserDataWrong.name;
    }).toThrow(TypeError);
  });
});
