// ─── Shared: theme, mock data, Header, Nav ───────────────────────────────────

const THEMES = {
  blue:  { primary:'#1677ff', primaryDark:'#0958d9', primaryBg:'#e6f4ff', badge:'#bae0ff' },
  teal:  { primary:'#0d9488', primaryDark:'#0f766e', primaryBg:'#ccfbf1', badge:'#99f6e4' },
  navy:  { primary:'#1e3a5f', primaryDark:'#162d4a', primaryBg:'#dbeafe', badge:'#bfdbfe' },
};

const TUMOR_COLORS = {
  '结直肠癌':'#3b82f6','胃癌':'#8b5cf6','食管癌':'#06b6d4',
  '胰腺癌':'#f59e0b','乳腺癌':'#ec4899','肺癌':'#10b981',
  '黑色素瘤':'#374151','其他':'#9ca3af',
};
const TUMOR_BG = {
  '结直肠癌':'#eff6ff','胃癌':'#f5f3ff','食管癌':'#ecfeff',
  '胰腺癌':'#fffbeb','乳腺癌':'#fdf2f8','肺癌':'#ecfdf5',
  '黑色素瘤':'#f9fafb','其他':'#f9fafb',
};

const STATUS_MAP = {0:'在随访',1:'已退出',2:'失访'};
const STATUS_COLOR = {0:'#10b981',1:'#ef4444',2:'#f59e0b'};
const STATUS_BG = {0:'#ecfdf5',1:'#fef2f2',2:'#fffbeb'};

const MOCK_PATIENTS = [
  {id:1,mrn:'JS2024001',name:'张明远',gender:0,age:58,site:'结直肠癌',metDate:'2023-06-12',lastFollowup:'2024-12-01',status:0,sync:0,rasStatus:'突变型',msi:'pMMR',incomplete:false},
  {id:2,mrn:'JS2024002',name:'李秀英',gender:1,age:52,site:'乳腺癌',metDate:'2023-08-20',lastFollowup:'2024-11-15',status:0,sync:1,rasStatus:'野生型',msi:'-',incomplete:false},
  {id:3,mrn:'JS2024003',name:'王建国',gender:0,age:65,site:'胃癌',metDate:'2023-03-05',lastFollowup:'2024-10-30',status:1,sync:0,rasStatus:'-',msi:'dMMR',incomplete:true},
  {id:4,mrn:'JS2024004',name:'陈美华',gender:1,age:47,site:'肺癌',metDate:'2024-01-18',lastFollowup:'2024-12-10',status:0,sync:1,rasStatus:'-',msi:'-',incomplete:false},
  {id:5,mrn:'JS2024005',name:'刘德志',gender:0,age:71,site:'胰腺癌',metDate:'2023-11-22',lastFollowup:'2024-09-05',status:2,sync:0,rasStatus:'-',msi:'-',incomplete:true},
  {id:6,mrn:'JS2024006',name:'赵文静',gender:1,age:44,site:'结直肠癌',metDate:'2024-02-14',lastFollowup:'2024-12-18',status:0,sync:1,rasStatus:'野生型',msi:'pMMR',incomplete:false},
  {id:7,mrn:'JS2024007',name:'孙志强',gender:0,age:63,site:'食管癌',metDate:'2023-09-30',lastFollowup:'2024-11-28',status:0,sync:0,rasStatus:'-',msi:'-',incomplete:false},
  {id:8,mrn:'JS2024008',name:'周晓燕',gender:1,age:55,site:'乳腺癌',metDate:'2024-03-07',lastFollowup:'2024-12-05',status:0,sync:1,rasStatus:'-',msi:'-',incomplete:false},
];

function maskName(name) {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

function TumorTag({site}) {
  return React.createElement('span', {
    style:{
      display:'inline-flex',alignItems:'center',padding:'2px 8px',borderRadius:4,
      fontSize:12,fontWeight:500,
      color:TUMOR_COLORS[site]||'#6b7280',
      background:TUMOR_BG[site]||'#f9fafb',
    }
  }, site);
}

function StatusBadge({status}) {
  return React.createElement('span', {
    style:{
      display:'inline-flex',alignItems:'center',gap:4,padding:'2px 8px',borderRadius:20,
      fontSize:12,fontWeight:500,
      color:STATUS_COLOR[status],
      background:STATUS_BG[status],
    }
  },
    React.createElement('span', {style:{width:6,height:6,borderRadius:'50%',background:STATUS_COLOR[status],display:'inline-block'}}),
    STATUS_MAP[status]
  );
}

function Header({currentScreen, onNavigate, theme}) {
  const T = THEMES[theme] || THEMES.blue;
  const navItems = [
    {key:'patients',label:'患者管理'},
    {key:'statistics',label:'统计分析'},
    {key:'export',label:'数据导出'},
  ];
  return React.createElement('header', {
    style:{
      background:'#fff',borderBottom:'1px solid #e5e7eb',
      position:'sticky',top:0,zIndex:100,
    }
  },
    React.createElement('div', {style:{height:3,background:`linear-gradient(90deg, ${T.primary}, ${T.primaryDark})`}}),
    React.createElement('div', {
      style:{
        maxWidth:1280,margin:'0 auto',padding:'0 24px',
        display:'flex',alignItems:'center',height:56,gap:32,
      }
    },
      // Logo
      React.createElement('div', {
        style:{display:'flex',alignItems:'center',gap:10,cursor:'pointer'},
        onClick:()=>onNavigate('patients')
      },
        React.createElement('img', {src:'assets/hospital-logo.png',style:{height:36,width:36,objectFit:'contain'}}),
        React.createElement('div', null,
          React.createElement('div', {style:{fontSize:15,fontWeight:700,color:'#111827',lineHeight:1.2}},'转移性肝癌患者登记系统'),
          React.createElement('div', {style:{fontSize:10,color:'#9ca3af',lineHeight:1.2}},'江苏省人民医院 · 肝胆外科'),
        )
      ),
      // Nav
      React.createElement('nav', {style:{display:'flex',gap:4,flex:1}},
        navItems.map(item =>
          React.createElement('button', {
            key:item.key,
            onClick:()=>onNavigate(item.key),
            style:{
              padding:'6px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:14,
              fontWeight:currentScreen===item.key?600:400,
              color:currentScreen===item.key?T.primary:'#6b7280',
              background:currentScreen===item.key?T.primaryBg:'transparent',
              transition:'all .15s',
            }
          }, item.label)
        )
      ),
      // User
      React.createElement('div', {style:{display:'flex',alignItems:'center',gap:8}},
        React.createElement('div', {
          style:{
            width:32,height:32,borderRadius:'50%',background:T.primary,
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',
          }
        },'浦'),
        React.createElement('div', {style:{lineHeight:1.3}},
          React.createElement('div', {style:{fontSize:13,fontWeight:500,color:'#111827'}},'浦立勇'),
          React.createElement('div', {style:{fontSize:11,color:'#9ca3af'}},'主任医师'),
        )
      )
    )
  );
}

Object.assign(window, {
  THEMES, TUMOR_COLORS, TUMOR_BG, STATUS_MAP, STATUS_COLOR, STATUS_BG,
  MOCK_PATIENTS, maskName, TumorTag, StatusBadge, Header,
});
