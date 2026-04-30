// ─── Patient Detail Screen ────────────────────────────────────────────────────

const MOCK_TREATMENTS = [
  {id:1,type:'systemic',label:'一线系统治疗',regimen:'FOLFOX + 贝伐珠单抗',start:'2023-07-01',end:'2023-12-15',response:'PR',line:1,color:'#3b82f6'},
  {id:2,type:'surgery',label:'肝切除手术',regimen:'腹腔镜左半肝切除',start:'2024-01-20',end:'2024-01-20',response:'',line:null,color:'#10b981'},
  {id:3,type:'systemic',label:'二线系统治疗',regimen:'FOLFIRI + 西妥昔单抗',start:'2024-03-10',end:'2024-09-01',response:'SD',line:2,color:'#3b82f6'},
  {id:4,type:'ablation',label:'消融治疗',regimen:'RFA（射频消融）S6段',start:'2024-10-05',end:'2024-10-05',response:'',line:null,color:'#8b5cf6'},
];
const MOCK_FOLLOWUPS = [
  {id:1,date:'2023-10-15',imaging:'CT',liver:0,extra:0,cea:45.2,ca199:210,status:1},
  {id:2,date:'2024-01-05',imaging:'MRI',liver:0,extra:0,cea:12.1,ca199:88,status:1},
  {id:3,date:'2024-04-20',imaging:'CT',liver:0,extra:0,cea:8.4,ca199:52,status:1},
  {id:4,date:'2024-08-10',imaging:'CT',liver:0,extra:0,cea:22.7,ca199:130,status:1},
  {id:5,date:'2024-12-01',imaging:'CT',liver:1,extra:0,cea:55.3,ca199:290,status:1},
];

function DetailScreen({patient, onBack, theme}) {
  const T = THEMES[theme] || THEMES.blue;
  const [tab, setTab] = React.useState('timeline');
  const [showAddTx, setShowAddTx] = React.useState(false);
  const [showAddFu, setShowAddFu] = React.useState(false);
  const p = patient || MOCK_PATIENTS[0];

  const tabs = [
    {key:'timeline',label:'治疗时间线'},
    {key:'followup',label:'随访记录'},
    {key:'biomarkers',label:'生物标志物'},
    {key:'info',label:'基本信息'},
  ];

  const BIOMARKERS = [
    {type:'RAS',result:'突变型（KRAS exon2）',date:'2023-06-20',color:'#ef4444'},
    {type:'BRAF',result:'野生型',date:'2023-06-20',color:'#10b981'},
    {type:'MSI',result:'pMMR（微卫星稳定）',date:'2023-06-20',color:'#10b981'},
    {type:'HER2',result:'阴性（1+）',date:'2023-06-20',color:'#10b981'},
  ];

  const txTypeColor = {systemic:'#3b82f6',surgery:'#10b981',ablation:'#8b5cf6',sbrt:'#f59e0b',other:'#6b7280'};
  const txTypeLabel = {systemic:'系统治疗',surgery:'肝切除',ablation:'消融',sbrt:'SBRT',other:'其他'};

  function Modal({title, onClose, children}) {
    return React.createElement('div',{
      style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center'},
      onClick:onClose,
    },
      React.createElement('div',{
        style:{background:'#fff',borderRadius:12,padding:28,width:520,maxHeight:'80vh',overflowY:'auto'},
        onClick:e=>e.stopPropagation(),
      },
        React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}},
          React.createElement('h3',{style:{margin:0,fontSize:16,fontWeight:700}},title),
          React.createElement('button',{onClick:onClose,style:{border:'none',background:'none',fontSize:18,cursor:'pointer',color:'#6b7280'}},'✕')
        ),
        children,
        React.createElement('div',{style:{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}},
          React.createElement('button',{onClick:onClose,style:{padding:'8px 18px',borderRadius:7,border:'1.5px solid #e5e7eb',background:'#fff',color:'#6b7280',cursor:'pointer',fontSize:13}},'取消'),
          React.createElement('button',{onClick:onClose,style:{padding:'8px 18px',borderRadius:7,border:'none',background:T.primary,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600}},'保存'),
        )
      )
    );
  }

  function TimelineView() {
    return React.createElement('div',{style:{padding:'8px 0'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'flex-end',marginBottom:16}},
        React.createElement('button',{
          onClick:()=>setShowAddTx(true),
          style:{padding:'8px 16px',borderRadius:7,border:'none',background:T.primary,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}
        },'＋ 添加治疗记录'),
      ),
      React.createElement('div',{style:{position:'relative',paddingLeft:32}},
        React.createElement('div',{style:{position:'absolute',left:12,top:0,bottom:0,width:2,background:'#e5e7eb'}}),
        MOCK_TREATMENTS.map((tx,i)=>
          React.createElement('div',{key:tx.id,style:{position:'relative',marginBottom:24}},
            React.createElement('div',{
              style:{
                position:'absolute',left:-26,top:12,width:14,height:14,borderRadius:'50%',
                background:txTypeColor[tx.type]||'#6b7280',border:'2px solid #fff',
                boxShadow:'0 0 0 2px '+(txTypeColor[tx.type]||'#6b7280')+'44',
              }
            }),
            React.createElement('div',{
              style:{
                background:'#fff',borderRadius:10,border:'1px solid #f1f5f9',padding:'14px 16px',
                boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
              }
            },
              React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:6}},
                React.createElement('span',{style:{
                  fontSize:11,padding:'2px 8px',borderRadius:4,fontWeight:600,
                  background:(txTypeColor[tx.type]||'#6b7280')+'18',color:txTypeColor[tx.type]||'#6b7280',
                }},txTypeLabel[tx.type]),
                tx.line && React.createElement('span',{style:{fontSize:11,color:'#9ca3af'}},'第'+tx.line+'线'),
                React.createElement('span',{style:{fontSize:11,color:'#9ca3af',marginLeft:'auto'}},tx.start+(tx.end&&tx.end!==tx.start?' 至 '+tx.end:'')),
              ),
              React.createElement('div',{style:{fontSize:14,fontWeight:600,color:'#111827',marginBottom:4}},tx.regimen),
              tx.response && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:6,marginTop:4}},
                React.createElement('span',{style:{fontSize:12,color:'#6b7280'}},'最佳疗效：'),
                React.createElement('span',{style:{
                  fontSize:12,fontWeight:700,padding:'1px 8px',borderRadius:4,
                  background:tx.response==='PR'?'#ecfdf5':tx.response==='SD'?'#fffbeb':tx.response==='PD'?'#fef2f2':'#f9fafb',
                  color:tx.response==='PR'?'#10b981':tx.response==='SD'?'#f59e0b':tx.response==='PD'?'#ef4444':'#6b7280',
                }},tx.response),
              ),
            )
          )
        )
      )
    );
  }

  function FollowupView() {
    const statusLabel = {0:'无瘤存活',1:'带瘤存活',2:'死亡'};
    const statusColor = {0:'#10b981',1:'#f59e0b',2:'#ef4444'};
    return React.createElement('div',null,
      React.createElement('div',{style:{display:'flex',justifyContent:'flex-end',marginBottom:16}},
        React.createElement('button',{
          onClick:()=>setShowAddFu(true),
          style:{padding:'8px 16px',borderRadius:7,border:'none',background:T.primary,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}
        },'＋ 添加随访记录'),
      ),
      // CEA trend
      React.createElement('div',{style:{background:'#f8fafc',borderRadius:8,padding:'12px 16px',marginBottom:16,fontSize:12,color:'#6b7280'}},
        'CEA趋势：',
        MOCK_FOLLOWUPS.map(f=>
          React.createElement('span',{key:f.id,style:{
            display:'inline-block',margin:'0 6px',padding:'2px 8px',borderRadius:4,
            background:f.cea>20?'#fff7ed':'#f0fdf4',color:f.cea>20?'#f59e0b':'#10b981',fontWeight:600
          }},f.date.slice(5)+' '+f.cea)
        )
      ),
      React.createElement('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:13}},
        React.createElement('thead',null,
          React.createElement('tr',{style:{background:'#f8fafc',borderBottom:'1px solid #f1f5f9'}},
            ['随访日期','影像检查','肝内复发','肝外转移','CEA','CA19-9','存活状态'].map((h,i)=>
              React.createElement('th',{key:i,style:{padding:'10px 12px',textAlign:'left',color:'#6b7280',fontSize:12,fontWeight:600}},h)
            )
          )
        ),
        React.createElement('tbody',null,
          MOCK_FOLLOWUPS.map((f,i)=>
            React.createElement('tr',{key:f.id,style:{borderBottom:'1px solid #f8fafc',background:i%2?'#fafbfc':'#fff'}},
              React.createElement('td',{style:{padding:'10px 12px',fontWeight:500}},f.date),
              React.createElement('td',{style:{padding:'10px 12px',color:'#374151'}},f.imaging),
              React.createElement('td',{style:{padding:'10px 12px'}},
                React.createElement('span',{style:{color:f.liver?'#ef4444':'#10b981',fontWeight:600}},f.liver?'是':'否')
              ),
              React.createElement('td',{style:{padding:'10px 12px'}},
                React.createElement('span',{style:{color:f.extra?'#ef4444':'#10b981',fontWeight:600}},f.extra?'是':'否')
              ),
              React.createElement('td',{style:{padding:'10px 12px',color:f.cea>20?'#f59e0b':'#374151',fontWeight:f.cea>20?600:400}},f.cea),
              React.createElement('td',{style:{padding:'10px 12px',color:f.ca199>37?'#f59e0b':'#374151',fontWeight:f.ca199>37?600:400}},f.ca199),
              React.createElement('td',{style:{padding:'10px 12px'}},
                React.createElement('span',{style:{fontSize:12,padding:'2px 8px',borderRadius:12,background:statusColor[f.status]+'18',color:statusColor[f.status]}},
                  statusLabel[f.status])
              ),
            )
          )
        )
      )
    );
  }

  function BiomarkersView() {
    return React.createElement('div',null,
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}},
        BIOMARKERS.map(b=>
          React.createElement('div',{key:b.type,style:{
            background:'#fff',borderRadius:8,border:'1px solid #f1f5f9',padding:'16px',
            display:'flex',alignItems:'center',gap:12,
          }},
            React.createElement('div',{style:{
              width:40,height:40,borderRadius:8,background:b.color+'18',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:13,fontWeight:700,color:b.color
            }},b.type),
            React.createElement('div',null,
              React.createElement('div',{style:{fontSize:14,fontWeight:600,color:'#111827'}},b.result),
              React.createElement('div',{style:{fontSize:11,color:'#9ca3af',marginTop:2}},'检测日期：'+b.date),
            )
          )
        )
      )
    );
  }

  function InfoView() {
    const rows = [
      ['病历号',p.mrn||'JS2024001'],['姓名',maskName(p.name||'张明远')],
      ['性别',p.gender===0?'男':'女'],['年龄',p.age+'岁'],
      ['原发肿瘤',p.site||'结直肠癌'],['原发诊断日期','2022-11-08'],
      ['肝转移日期',p.metDate||'2023-06-12'],['转移类型',p.sync===0?'同时性':'异时性'],
      ['转移灶数目','3枚'],['最大径线','4.5 cm'],
      ['基线CEA','258.3 ng/mL'],['基线CA19-9','412.7 U/mL'],
    ];
    return React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:1,background:'#f1f5f9',borderRadius:8,overflow:'hidden'}},
      rows.map(([k,v],i)=>
        React.createElement('div',{key:i,style:{background:'#fff',padding:'12px 16px'}},
          React.createElement('div',{style:{fontSize:11,color:'#9ca3af',marginBottom:2}},k),
          React.createElement('div',{style:{fontSize:14,fontWeight:500,color:'#111827'}},v),
        )
      )
    );
  }

  return React.createElement('div',{style:{minHeight:'100vh',background:'#f8fafc'}},
    // Breadcrumb
    React.createElement('div',{style:{background:'#fff',borderBottom:'1px solid #f1f5f9',padding:'10px 24px'}},
      React.createElement('div',{style:{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#9ca3af'}},
        React.createElement('span',{style:{cursor:'pointer',color:'#6b7280'},onClick:onBack},'患者管理'),
        React.createElement('span',null,' › '),
        React.createElement('span',{style:{color:'#111827',fontWeight:500}},maskName(p.name||'张明远')),
      )
    ),

    React.createElement('div',{style:{maxWidth:1100,margin:'0 auto',padding:'20px 24px'}},
      // Patient summary card
      React.createElement('div',{style:{
        background:'#fff',borderRadius:12,border:'1px solid #f1f5f9',padding:'20px 24px',
        marginBottom:16,display:'flex',alignItems:'center',gap:20,
      }},
        React.createElement('div',{style:{
          width:52,height:52,borderRadius:'50%',background:T.primaryBg,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:20,fontWeight:700,color:T.primary,flexShrink:0,
        }},maskName(p.name||'张明远')[0]),
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:6}},
            React.createElement('span',{style:{fontSize:18,fontWeight:700,color:'#111827'}},maskName(p.name||'张明远')),
            React.createElement(TumorTag,{site:p.site||'结直肠癌'}),
            React.createElement(StatusBadge,{status:p.status||0}),
          ),
          React.createElement('div',{style:{display:'flex',gap:20,fontSize:12,color:'#6b7280'}},
            React.createElement('span',null,'病历号：'+( p.mrn||'JS2024001')),
            React.createElement('span',null,'性别：'+(p.gender===0?'男':'女')+'  ·  年龄：'+(p.age||58)+'岁'),
            React.createElement('span',null,'肝转移诊断：'+(p.metDate||'2023-06-12')),
            React.createElement('span',null,'转移类型：'+(p.sync===0?'同时性':'异时性')),
          ),
        ),
        React.createElement('div',{style:{display:'flex',gap:8}},
          React.createElement('button',{style:{padding:'7px 14px',borderRadius:7,border:'1.5px solid #e5e7eb',background:'#fff',fontSize:12,color:'#6b7280',cursor:'pointer'}},'编辑信息'),
          React.createElement('button',{
            onClick:()=>setShowAddFu(true),
            style:{padding:'7px 14px',borderRadius:7,border:'none',background:T.primary,color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}
          },'添加随访'),
        )
      ),

      // Tabs + content
      React.createElement('div',{style:{background:'#fff',borderRadius:12,border:'1px solid #f1f5f9',overflow:'hidden'}},
        React.createElement('div',{style:{display:'flex',borderBottom:'1px solid #f1f5f9',padding:'0 20px'}},
          tabs.map(t=>
            React.createElement('button',{
              key:t.key,onClick:()=>setTab(t.key),
              style:{
                padding:'14px 16px',border:'none',background:'none',cursor:'pointer',fontSize:14,
                fontWeight:tab===t.key?600:400,
                color:tab===t.key?T.primary:'#6b7280',
                borderBottom:'2px solid '+(tab===t.key?T.primary:'transparent'),
                marginBottom:-1,
              }
            },t.label)
          )
        ),
        React.createElement('div',{style:{padding:20}},
          tab==='timeline' && React.createElement(TimelineView),
          tab==='followup' && React.createElement(FollowupView),
          tab==='biomarkers' && React.createElement(BiomarkersView),
          tab==='info' && React.createElement(InfoView),
        )
      )
    ),

    // Add Treatment Modal
    showAddTx && React.createElement(Modal,{title:'添加治疗记录',onClose:()=>setShowAddTx(false)},
      React.createElement('div',{style:{display:'grid',gap:12}},
        React.createElement('div',null,
          React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'治疗类型 *'),
          React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
            React.createElement('option',null,'系统治疗（化疗/靶向/免疫）'),
            React.createElement('option',null,'肝切除手术'),
            React.createElement('option',null,'消融治疗（RFA/MWA）'),
            React.createElement('option',null,'SBRT 立体定向放疗'),
            React.createElement('option',null,'其他'),
          )
        ),
        React.createElement('div',null,
          React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'方案/术式 *'),
          React.createElement('input',{placeholder:'如：FOLFOX + 贝伐珠单抗',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'开始日期 *'),
            React.createElement('input',{type:'date',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
          ),
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'结束日期'),
            React.createElement('input',{type:'date',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
          ),
        ),
        React.createElement('div',null,
          React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'最佳疗效'),
          React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
            React.createElement('option',{value:''},'— 选择 —'),
            React.createElement('option',null,'CR（完全缓解）'),
            React.createElement('option',null,'PR（部分缓解）'),
            React.createElement('option',null,'SD（疾病稳定）'),
            React.createElement('option',null,'PD（疾病进展）'),
          )
        ),
      )
    ),

    // Add Followup Modal
    showAddFu && React.createElement(Modal,{title:'添加随访记录',onClose:()=>setShowAddFu(false)},
      React.createElement('div',{style:{display:'grid',gap:12}},
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'随访日期 *'),
            React.createElement('input',{type:'date',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
          ),
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'影像检查方式'),
            React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
              React.createElement('option',null,'CT'),
              React.createElement('option',null,'MRI'),
              React.createElement('option',null,'PET/CT'),
              React.createElement('option',null,'超声'),
              React.createElement('option',null,'无'),
            )
          ),
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'CEA（ng/mL）'),
            React.createElement('input',{type:'number',step:'0.01',placeholder:'如：45.2',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
          ),
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'CA19-9（U/mL）'),
            React.createElement('input',{type:'number',step:'0.01',placeholder:'如：210',style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none',boxSizing:'border-box'}}),
          ),
        ),
        React.createElement('div',null,
          React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'存活状态 *'),
          React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
            React.createElement('option',null,'无瘤存活（Alive NED）'),
            React.createElement('option',null,'带瘤存活（Alive with disease）'),
            React.createElement('option',null,'死亡（Dead）'),
          )
        ),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'肝内复发'),
            React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
              React.createElement('option',null,'否'),React.createElement('option',null,'是')
            )
          ),
          React.createElement('div',null,
            React.createElement('label',{style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}},'新发肝外转移'),
            React.createElement('select',{style:{width:'100%',padding:'8px 12px',borderRadius:7,border:'1.5px solid #e5e7eb',fontSize:14,outline:'none'}},
              React.createElement('option',null,'否'),React.createElement('option',null,'是')
            )
          ),
        ),
      )
    ),
  );
}

Object.assign(window, { DetailScreen });
