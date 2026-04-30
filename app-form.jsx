// ─── Multi-step Patient Entry Form ───────────────────────────────────────────

function FormScreen({onBack, theme}) {
  const T = THEMES[theme] || THEMES.blue;
  const [step, setStep] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const [form, setForm] = React.useState({
    mrn:'', name:'', gender:'0', birthDate:'', phone:'',
    site:'结直肠癌', diagDate:'', surgery:'0', surgeryDate:'', surgeryType:'',
    metDate:'', sync:'0', metNumber:'', metSize:'', metDist:'Unilobar',
    markers:[{type:'RAS',result:'',date:''}],
    cea:'', ca199:'',
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const STEPS = ['身份与诊断','肝转移详情','生物标志物','基线实验室'];

  const inputCls = {
    padding:'8px 12px', borderRadius:7, border:'1.5px solid #e5e7eb',
    fontSize:14, outline:'none', fontFamily:'inherit', width:'100%',
    boxSizing:'border-box', transition:'border .15s',
  };
  const focus = e => e.target.style.borderColor = T.primary;
  const blur  = e => e.target.style.borderColor = '#e5e7eb';
  const label = (txt,tip) => React.createElement('label', {
    style:{fontSize:12,fontWeight:600,color:'#374151',display:'block',marginBottom:5}
  }, txt, tip && React.createElement('span',{
    title:tip,
    style:{marginLeft:4,display:'inline-flex',alignItems:'center',justifyContent:'center',
      width:14,height:14,borderRadius:'50%',background:'#e5e7eb',color:'#6b7280',
      fontSize:10,cursor:'help',fontWeight:400}
  },'?'));
  const row = (...children) => React.createElement('div',{style:{display:'grid',gridTemplateColumns:`repeat(${children.length},1fr)`,gap:16,marginBottom:16}}, ...children);
  const field = (lbl,el,tip) => React.createElement('div',null, label(lbl,tip), el);
  const inp = (k,ph,extra={}) => React.createElement('input',{
    value:form[k], onChange:e=>set(k,e.target.value),
    placeholder:ph, style:inputCls, onFocus:focus, onBlur:blur, ...extra
  });
  const sel = (k,opts) => React.createElement('select',{
    value:form[k], onChange:e=>set(k,e.target.value),
    style:{...inputCls,background:'#fff',cursor:'pointer'},
    onFocus:focus, onBlur:blur,
  }, opts.map(([v,l])=>React.createElement('option',{key:v,value:v},l)));

  function stepContent() {
    if (step===0) return React.createElement('div', null,
      React.createElement('p',{style:{fontSize:13,color:'#9ca3af',marginBottom:20}},'* 为必填项'),
      row(
        field('病历号 *', inp('mrn','如 JS2024001')),
        field('患者姓名 *', inp('name','实际姓名（显示脱敏）')),
      ),
      row(
        field('性别 *', sel('gender',[['0','男'],['1','女']])),
        field('出生日期', inp('birthDate','',{type:'date'})),
        field('联系电话', inp('phone','手机号')),
      ),
      row(
        field('原发肿瘤部位 *', sel('site',[
          ['结直肠癌','结直肠癌'],['胃癌','胃癌'],['食管癌','食管癌'],
          ['胰腺癌','胰腺癌'],['乳腺癌','乳腺癌'],['肺癌','肺癌'],
          ['黑色素瘤','黑色素瘤'],['其他','其他'],
        ])),
        field('原发诊断日期 *', inp('diagDate','',{type:'date'})),
      ),
      row(
        field('原发肿瘤切除 *', sel('surgery',[['0','否'],['1','是（已切除）']])),
        form.surgery==='1' && field('手术日期 *', inp('surgeryDate','',{type:'date'})),
        form.surgery==='1' && field('手术类型', inp('surgeryType','如：右半结肠切除')),
      ),
    );
    if (step===1) return React.createElement('div', null,
      row(
        field('肝转移诊断日期 *', inp('metDate','',{type:'date'})),
        field('转移类型 *','同时性/异时性', sel('sync',[['0','同时性（Synchronous）'],['1','异时性（Metachronous）']])),
      ),
      row(
        field('转移灶数目 *', inp('metNumber','如：3', {type:'number',min:1}), '诊断时肝内可见病灶数'),
        field('最大病灶径线（cm）*', inp('metSize','如：4.5', {type:'number',step:'0.1'})),
        field('分布 *', sel('metDist',[['Unilobar','单叶（Unilobar）'],['Bilobar','双叶（Bilobar）']])),
      ),
      React.createElement('div',{style:{padding:'12px 14px',borderRadius:8,background:'#fffbeb',border:'1px solid #fde68a',fontSize:12,color:'#92400e',marginTop:4}},
        '⚠ 提示：同时性转移定义为原发诊断后180天内发现肝转移。如超出范围，请确认并选择"异时性"。'
      ),
    );
    if (step===2) {
      const siteMarkers = {
        '结直肠癌':['RAS','BRAF','MSI','HER2'],
        '乳腺癌':['ER','PR','HER2','BRCA'],
        '肺癌':['EGFR','ALK','ROS1','PD-L1'],
        '胃癌':['HER2','MSI','PD-L1'],
      };
      const recommended = siteMarkers[form.site] || ['RAS','MSI'];
      return React.createElement('div', null,
        React.createElement('p',{style:{fontSize:13,color:'#6b7280',marginBottom:16}},
          `根据 ${form.site} 推荐检测：`,
          recommended.map(m=>React.createElement('span',{key:m,style:{
            display:'inline-block',margin:'0 4px',padding:'1px 8px',borderRadius:12,
            background:T.primaryBg,color:T.primary,fontSize:12,fontWeight:500,
          }},m))
        ),
        form.markers.map((m,i)=>
          React.createElement('div',{key:i,style:{
            display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:10,alignItems:'end',marginBottom:10
          }},
            field(i===0?'标志物类型':'',
              React.createElement('select',{
                value:m.type,
                onChange:e=>{const ms=[...form.markers];ms[i]={...ms[i],type:e.target.value};set('markers',ms)},
                style:{...inputCls,background:'#fff'},onFocus:focus,onBlur:blur,
              },
                ['RAS','BRAF','MSI','HER2','EGFR','ALK','ROS1','ER','PR','BRCA','其他']
                  .map(t=>React.createElement('option',{key:t,value:t},t))
              )
            ),
            field(i===0?'检测结果':'',
              React.createElement('input',{
                value:m.result, placeholder:'如：突变型 / 阳性',
                onChange:e=>{const ms=[...form.markers];ms[i]={...ms[i],result:e.target.value};set('markers',ms)},
                style:inputCls,onFocus:focus,onBlur:blur,
              })
            ),
            field(i===0?'检测日期':'',
              React.createElement('input',{
                type:'date', value:m.date,
                onChange:e=>{const ms=[...form.markers];ms[i]={...ms[i],date:e.target.value};set('markers',ms)},
                style:inputCls,onFocus:focus,onBlur:blur,
              })
            ),
            React.createElement('button',{
              onClick:()=>{const ms=form.markers.filter((_,j)=>j!==i);set('markers',ms.length?ms:[{type:'RAS',result:'',date:''}])},
              style:{padding:'8px 10px',borderRadius:7,border:'1px solid #fca5a5',background:'#fff',color:'#ef4444',cursor:'pointer',marginBottom:0,fontSize:13}
            },'✕')
          )
        ),
        React.createElement('button',{
          onClick:()=>set('markers',[...form.markers,{type:'RAS',result:'',date:''}]),
          style:{padding:'7px 16px',borderRadius:7,border:'1.5px dashed '+T.primary,background:T.primaryBg,color:T.primary,fontSize:13,cursor:'pointer',marginTop:4}
        },'＋ 添加标志物'),
      );
    }
    if (step===3) return React.createElement('div', null,
      React.createElement('p',{style:{fontSize:13,color:'#6b7280',marginBottom:20}},'请录入肝转移诊断时的基线肿瘤标志物水平。'),
      row(
        field('基线 CEA（ng/mL）', inp('cea','如：125.6',{type:'number',step:'0.01'}), '癌胚抗原，正常参考值 <5 ng/mL'),
        field('基线 CA19-9（U/mL）', inp('ca199','如：380.2',{type:'number',step:'0.01'}), '糖类抗原19-9，正常参考值 <37 U/mL'),
      ),
      React.createElement('div',{style:{padding:'14px 16px',borderRadius:8,background:'#f0fdf4',border:'1px solid #bbf7d0',fontSize:13,color:'#166534',marginTop:8}},
        '✓ 以上为患者基本信息，提交后将进入治疗记录录入。建议同步上传影像报告附件（后续可在患者详情页操作）。'
      ),
    );
  }

  return React.createElement('div', {style:{minHeight:'100vh',background:'#f8fafc'}},
    // Breadcrumb
    React.createElement('div', {style:{background:'#fff',borderBottom:'1px solid #f1f5f9',padding:'10px 24px'}},
      React.createElement('div', {style:{maxWidth:900,margin:'0 auto',display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#9ca3af'}},
        React.createElement('span',{style:{cursor:'pointer',color:'#6b7280'},onClick:onBack},'患者管理'),
        React.createElement('span',null,' › '),
        React.createElement('span',{style:{color:'#111827',fontWeight:500}},'新增患者'),
      )
    ),

    React.createElement('div', {style:{maxWidth:900,margin:'0 auto',padding:'28px 24px'}},
      // Step bar
      React.createElement('div', {style:{display:'flex',alignItems:'center',marginBottom:32}},
        STEPS.map((s,i)=>React.createElement(React.Fragment,{key:i},
          React.createElement('div', {
            style:{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:i<step?'pointer':'default'},
            onClick:()=>i<step&&setStep(i),
          },
            React.createElement('div', {
              style:{
                width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:13,fontWeight:700,
                background:i<step?T.primary:i===step?T.primary:'#e5e7eb',
                color:i<=step?'#fff':'#9ca3af',
                border:i===step?'3px solid '+T.primaryBg:'3px solid transparent',
                boxSizing:'border-box',
              }
            }, i<step?'✓':(i+1)),
            React.createElement('div', {style:{fontSize:11,color:i===step?T.primary:'#9ca3af',fontWeight:i===step?600:400,whiteSpace:'nowrap'}},s),
          ),
          i<STEPS.length-1 && React.createElement('div', {
            style:{flex:1,height:2,background:i<step?T.primary:'#e5e7eb',margin:'0 8px 20px',borderRadius:1}
          })
        ))
      ),

      // Card
      React.createElement('div', {style:{background:'#fff',borderRadius:12,border:'1px solid #f1f5f9',padding:'28px'}},
        React.createElement('h3', {style:{margin:'0 0 20px',fontSize:16,fontWeight:700,color:'#111827'}}, STEPS[step]),
        stepContent(),
      ),

      // Actions
      React.createElement('div', {style:{display:'flex',justifyContent:'space-between',marginTop:20,alignItems:'center'}},
        React.createElement('div', {style:{display:'flex',gap:10}},
          React.createElement('button', {
            onClick:()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)},
            style:{padding:'8px 18px',borderRadius:7,border:'1.5px solid #e5e7eb',background:'#fff',color:'#6b7280',fontSize:13,cursor:'pointer'}
          }, saved?'✓ 已保存草稿':'保存草稿'),
          step>0 && React.createElement('button', {
            onClick:()=>setStep(s=>s-1),
            style:{padding:'8px 18px',borderRadius:7,border:'1.5px solid #e5e7eb',background:'#fff',color:'#374151',fontSize:13,cursor:'pointer'}
          },'← 上一步'),
        ),
        step<STEPS.length-1
          ? React.createElement('button', {
              onClick:()=>setStep(s=>s+1),
              style:{padding:'9px 28px',borderRadius:7,border:'none',background:T.primary,color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer'}
            },'下一步 →')
          : React.createElement('button', {
              onClick:onBack,
              style:{padding:'9px 28px',borderRadius:7,border:'none',background:'#10b981',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer'}
            },'提交入组 ✓'),
      )
    )
  );
}

Object.assign(window, { FormScreen });
