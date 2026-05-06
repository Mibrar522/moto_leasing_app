export default function UserTasks({
  canViewWorkflowTasks,
  workflowTasksTableRef,
  pendingWorkflowTasks,
  completedWorkflowTasks,
  workflowTaskGroups,
  renderEmptyState,
  getStatusClass,
  selectedWorkflowTaskId,
  formatWorkflowDealerIdentity,
  setSelectedWorkflowTaskId,
}) {
  if (!canViewWorkflowTasks) {
    return <div className="feedback-card error">Your account does not have user task access.</div>;
  }

  return (
    <>
      <div className="page-heading">
        <h1>User Tasks</h1>
        <p>All approval requests come here for the assigned manager or application admin to review customer details, vehicle details, and attachments.</p>
      </div>

      <div className="table-card" ref={workflowTasksTableRef}>
        <div className="section-header">
          <h3>User Task Queue</h3>
          <span className="section-caption">{pendingWorkflowTasks.length} pending / {completedWorkflowTasks.length} completed</span>
        </div>
        {workflowTaskGroups.length === 0 ? renderEmptyState('No workflow tasks are available for this user right now.') : (
          <table className="pro-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Dealer / Requester</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Attachment</th>
                <th>Route</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workflowTaskGroups.map((group) => {
                const task = group.primaryTask;
                return (
                  <tr key={`user-task-group-${group.key}`} className={task?.id === selectedWorkflowTaskId ? 'workflow-task-row is-selected' : 'workflow-task-row'}>
                    <td><span className={getStatusClass(group.overallStatus)}>{group.overallStatus}</span></td>
                    <td>{formatWorkflowDealerIdentity(task)}<br />{task?.requester_name || 'Unknown requester'}</td>
                    <td>{task?.customer_name || 'Not set'}<br />{task?.cnic_passport_number || 'No ID'}</td>
                    <td>{task?.brand} {task?.model}<br />{task?.serial_number || task?.registration_number || 'No serial'}</td>
                    <td>{task?.agreement_pdf_url ? 'Attached' : 'No file'}</td>
                    <td>{task.requester_name || 'Unknown'} â†’ {task.assigned_role_name} ({task.step_number}/{task.total_steps})</td>
                    <td><button type="button" className="view-btn" onClick={() => setSelectedWorkflowTaskId(task?.id || '')}>View Details</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
