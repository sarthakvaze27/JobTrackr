interface Topbarprops{
    currentNav:string;
    currentTab:string;
    setCurrentTab: (tab:string) => void;
    setShowAddModal:(val:boolean) => void;
    onLogout: () => void;
}

const Topbar = ({currentNav,currentTab, setCurrentTab,setShowAddModal,onLogout}:Topbarprops) => {
    const getTitle = () => {
        switch(currentNav)
        {
            case 'board':
      case 'applications': return 'Applications Board';
      case 'interviews': return 'Interviews';
      case 'analytics': return 'Analytics';
      case 'companies': return 'Companies';
      case 'settings': return 'Settings';
      default: return 'Applications Board';
        }
    }

    const isBoardView = currentNav === 'board' || currentNav ==='applications';
    const canAdd = isBoardView || currentNav === 'documents';
    const addLabel = currentNav === 'documents' ? 'Upload File' : 'Add Job';
    return(
        <div className="nav-top">
            <div className="nav-left">{getTitle()}</div>
            <div className="nav-right">
                {isBoardView && (
                    <div className="table">
                    <div className={`nii ${currentTab === 'kanban' ? 'active':''}`} onClick={() => setCurrentTab('kanban')}>kanban</div>
                    <div className={`nii ${currentTab === 'table' ? 'active':''}`} onClick={() => setCurrentTab('table')}>table</div>
                </div>
                )}
                
                <div className="search-box">
          <i className="ti ti-search"></i>
          <input type="text" placeholder="Search applications…" />
        </div>
               <button className="filter-btn">
          <i className="ti ti-filter"></i> Filter
        </button>
        
        {canAdd && <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <i className={`ti ${currentNav === 'documents' ? 'ti-upload' : 'ti-plus'}`} />
          <span>{addLabel}</span>
        </button>}
        <button className="logout-btn" onClick={onLogout} title="Logout">
          <i className="ti ti-logout"></i>
        </button>
            </div>
        </div>
    );
}

export default Topbar;
