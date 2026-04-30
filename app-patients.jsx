// ─── Patient List Screen ──────────────────────────────────────────────────────

function PatientsScreen({onNavigate, onNewPatient, onViewPatient, theme}) {
  const T = THEMES[theme] || THEMES.blue;
  const [search, setSearch] = React.useState('');
  const [siteFilter, setSiteFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 6;

  const sites = ['结直肠癌','胃癌','食管癌','胰腺癌','乳腺癌','肺癌','黑色素瘤','其他'];

  const filtered = MOCK_PATIENTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.mrn.toLowerCase().includes(q) || p.name.includes(q);
    const matchSite = !siteFilter || p.site === siteFilter;
    const matchStatus = statusFilter==='' || p.status === Number(statusFilter);
    return matchSearch && matchSite && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const selStyle = {
    padding:'7px 12px', borderRadius:7, border:'1.5px solid #e5e7eb',
    fontSize:13, outline:'none', background:'#fff', color:'#374151', cursor:'pointer',
  };

  return React.createElement('div', {style:{minHeight:'100vh',background:'#f8fafc'}},
    // Toolbar
    React.createElement('div', {style:{background:'#fff',borderBottom:'1px solid #f1f5f9',padding:'16px 24px'}},
      React.createElement('div', {style:{maxWidth:1280,margin:'0 auto'}},
        // Row 1: title + button
        React.createElement('div', {style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}},
          React.createElement('div', null,
            React.createElement('h2', {style:{margin:0,fontSize:18,fontWeight:700,color:'#111827'}},'患者管理'),
            React.createElement('p', {style:{margin:0,fontSize:12,color:'#9ca3af',marginTop:2}},'共 '+MOCK_PATIENTS.length+' 例 · 多中心登记'),
          ),
          React.createElement('button', {
            onClick:onNewPatient,
            style:{
              padding:'9px 20px',borderRadius:8,border:'none',
              background:T.primary,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',
              display:'flex',alignItems:'center',gap:6,
            }
          },'＋ 新增患者')
        ),
        // Row 2: filters
        React.createElement('div', {style:{display:'flex',gap:10,flexWrap:'wrap'}},
          React.createElement('input', {
            value:search, onChange:e=>{setSearch(e.target.value);setPage(1)},
            placeholder:'🔍 病历号 / 姓名',
            style:{...selStyle, minWidth:200, padding:'7px 14px'},
          }),
          React.createElement('select', {value:siteFilter,onChange:e=>{setSiteFilter(e.target.value);setPage(1)},style:selStyle},
            React.createElement('option',{value:''},'原发肿瘤部位（全部）'),
            sites.map(s=>React.createElement('option',{key:s,value:s},s))
          ),
          React.createElement('select', {value:statusFilter,onChange:e=>{setStatusFilter(e.target.value);setPage(1)},style:selStyle},
            React.createElement('option',{value:''},'随访状态（全部）'),
            React.createElement('option',{value:'0'},'在随访'),
            React.createElement('option',{value:'1'},'已退出'),
            React.createElement('option',{value:'2'},'失访'),
          ),
          search||siteFilter||statusFilter!=='' ? React.createElement('button', {
            onClick:()=>{setSearch('');setSiteFilter('');setStatusFilter('');setPage(1)},
            style:{...selStyle,color:'#6b7280',fontSize:12}
          },'✕ 清除筛选') : null,
        )
      )
    ),

    // Table
    React.createElement('div', {style:{maxWidth:1280,margin:'0 auto',padding:'20px 24px'}},
      React.createElement('div', {style:{background:'#fff',borderRadius:12,border:'1px solid #f1f5f9',overflow:'hidden'}},
        React.createElement('table', {style:{width:'100%',borderCollapse:'collapse',fontSize:13}},
          React.createElement('thead', null,
            React.createElement('tr', {style:{background:'#f8fafc',borderBottom:'1px solid #f1f5f9'}},
              ['病历号','姓名','原发肿瘤','肝转移诊断日期','末次随访','随访状态','RAS','操作'].map((h,i)=>
                React.createElement('th', {
                  key:i,
                  style:{padding:'11px 16px',textAlign:'left',fontWeight:600,color:'#6b7280',fontSize:12,letterSpacing:.3,whiteSpace:'nowrap'}
                }, h)
              )
            )
          ),
          React.createElement('tbody', null,
            rows.length === 0
              ? React.createElement('tr', null,
                  React.createElement('td', {colSpan:8, style:{padding:48,textAlign:'center',color:'#9ca3af',fontSize:14}}, '暂无匹配数据')
                )
              : rows.map((p,i)=>
                React.createElement('tr', {
                  key:p.id,
                  style:{
                    borderBottom:'1px solid #f8fafc',
                    background:i%2===0?'#fff':'#fafbfc',
                    cursor:'pointer',
                    transition:'background .1s',
                  },
                  onMouseEnter:e=>e.currentTarget.style.background='#f0f7ff',
                  onMouseLeave:e=>e.currentTarget.style.background=i%2===0?'#fff':'#fafbfc',
                  onClick:()=>onViewPatient(p),
                },
                  React.createElement('td', {style:{padding:'12px 16px',color:'#6b7280',fontFamily:'monospace',fontSize:12}},
                    React.createElement('span', {style:{display:'flex',alignItems:'center',gap:6}},
                      p.mrn,
                      p.incomplete && React.createElement('span', {
                        title:'存在必填项未完成',
                        style:{fontSize:10,padding:'1px 5px',borderRadius:3,background:'#fff7ed',color:'#f59e0b',fontFamily:'sans-serif'}
                      },'未完成')
                    )
                  ),
                  React.createElement('td', {style:{padding:'12px 16px',fontWeight:500,color:'#111827'}}, maskName(p.name)),
                  React.createElement('td', {style:{padding:'12px 16px'}}, React.createElement(TumorTag,{site:p.site})),
                  React.createElement('td', {style:{padding:'12px 16px',color:'#374151'}}, p.metDate),
                  React.createElement('td', {style:{padding:'12px 16px',color:'#374151'}}, p.lastFollowup),
                  React.createElement('td', {style:{padding:'12px 16px'}}, React.createElement(StatusBadge,{status:p.status})),
                  React.createElement('td', {style:{padding:'12px 16px',color:'#6b7280',fontSize:12}}, p.rasStatus||'—'),
                  React.createElement('td', {style:{padding:'12px 16px'}},
                    React.createElement('div', {style:{display:'flex',gap:8}},
                      React.createElement('button', {
                        onClick:e=>{e.stopPropagation();onViewPatient(p)},
                        style:{padding:'4px 10px',borderRadius:5,border:'1px solid '+T.primary,background:'transparent',color:T.primary,fontSize:12,cursor:'pointer'}
                      },'详情'),
                      React.createElement('button', {
                        onClick:e=>{e.stopPropagation();onViewPatient(p)},
                        style:{padding:'4px 10px',borderRadius:5,border:'1px solid #e5e7eb',background:'transparent',color:'#6b7280',fontSize:12,cursor:'pointer'}
                      },'随访'),
                    )
                  ),
                )
              )
          )
        ),

        // Pagination
        React.createElement('div', {
          style:{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'12px 16px',borderTop:'1px solid #f1f5f9',
          }
        },
          React.createElement('span', {style:{fontSize:12,color:'#9ca3af'}},
            `共 ${filtered.length} 条，第 ${page}/${Math.max(1,totalPages)} 页`
          ),
          React.createElement('div', {style:{display:'flex',gap:4}},
            React.createElement('button', {
              onClick:()=>setPage(p=>Math.max(1,p-1)), disabled:page===1,
              style:{padding:'4px 12px',borderRadius:5,border:'1px solid #e5e7eb',background:'#fff',color:page===1?'#d1d5db':'#374151',cursor:page===1?'not-allowed':'pointer',fontSize:13}
            },'‹ 上页'),
            React.createElement('button', {
              onClick:()=>setPage(p=>Math.min(totalPages,p+1)), disabled:page>=totalPages,
              style:{padding:'4px 12px',borderRadius:5,border:'1px solid #e5e7eb',background:'#fff',color:page>=totalPages?'#d1d5db':'#374151',cursor:page>=totalPages?'not-allowed':'pointer',fontSize:13}
            },'下页 ›'),
          )
        )
      ),

      // Summary cards
      React.createElement('div', {style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:16}},
        [
          {label:'登记患者',value:MOCK_PATIENTS.length+'例',sub:'多中心合计',color:T.primary},
          {label:'在随访',value:MOCK_PATIENTS.filter(p=>p.status===0).length+'例',sub:'占比 '+Math.round(MOCK_PATIENTS.filter(p=>p.status===0).length/MOCK_PATIENTS.length*100)+'%',color:'#10b981'},
          {label:'同时性转移',value:MOCK_PATIENTS.filter(p=>p.sync===0).length+'例',sub:'占比 '+Math.round(MOCK_PATIENTS.filter(p=>p.sync===0).length/MOCK_PATIENTS.length*100)+'%',color:'#f59e0b'},
          {label:'资料待完善',value:MOCK_PATIENTS.filter(p=>p.incomplete).length+'例',sub:'需要补录',color:'#ef4444'},
        ].map((c,i)=>
          React.createElement('div', {
            key:i,
            style:{background:'#fff',borderRadius:10,padding:'14px 16px',border:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:12}
          },
            React.createElement('div', {style:{width:36,height:36,borderRadius:8,background:c.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}),
            React.createElement('div', null,
              React.createElement('div', {style:{fontSize:20,fontWeight:700,color:c.color,lineHeight:1}}),
              React.createElement('div', {style:{fontSize:18,fontWeight:700,color:'#111827',lineHeight:1.2}},c.value),
              React.createElement('div', {style:{fontSize:11,color:'#9ca3af',marginTop:2}},c.sub+' · '+c.label),
            )
          )
        )
      )
    )
  );
}

Object.assign(window, { PatientsScreen });
