from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import WorkspaceService, AppService, DHService

workspaces_bp = Blueprint('workspaces', __name__)

# Services will be initialized in main app
workspace_service = None
app_service = None
dh_service = None

def init_services(ws, apps, dh):
    """Initialize services from main app"""
    global workspace_service, app_service, dh_service
    workspace_service = ws
    app_service = apps
    dh_service = dh

@workspaces_bp.route('/workspaces', methods=['GET'])
def list_workspaces():
    """List all workspaces"""
    try:
        workspaces = workspace_service.list_workspaces()
        return jsonify(workspaces)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workspaces_bp.route('/workspaces', methods=['POST'])
@jwt_required()
def create_workspace():
    """Create a new workspace"""
    try:
        data = request.get_json()
        
        workspace = workspace_service.create_workspace(
            code=data['code'],
            domain=data['domain'],
            name=data['name']
        )
        
        return jsonify({
            'message': 'Workspace created',
            'workspace': workspace.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workspaces_bp.route('/workspaces/<workspace_code>', methods=['GET'])
def get_workspace(workspace_code):
    """Get workspace details"""
    try:
        workspace = workspace_service.get_workspace(workspace_code)
        if not workspace:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Remove MongoDB _id
        workspace.pop('_id', None)
        return jsonify(workspace)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workspaces_bp.route('/workspaces/<workspace_code>/dh', methods=['POST'])
@jwt_required()
def add_dh_to_workspace(workspace_code):
    """Add a DH to workspace"""
    try:
        data = request.get_json()
        dh_email = data.get('dh_email')
        
        if not dh_email:
            return jsonify({'error': 'DH email required'}), 400
        
        success = workspace_service.add_dh_to_workspace(workspace_code, dh_email)
        
        if success:
            return jsonify({'message': f'DH {dh_email} added to workspace'}), 200
        else:
            return jsonify({'error': 'Failed to add DH'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workspaces_bp.route('/workspaces/<workspace_code>/apps', methods=['POST'])
@jwt_required()
def install_app_in_workspace(workspace_code):
    """Install an app in workspace"""
    try:
        data = request.get_json()
        app_code = data.get('app_code')
        
        if not app_code:
            return jsonify({'error': 'App code required'}), 400
        
        # Check if app exists
        app = app_service.get_app(app_code)
        if not app:
            return jsonify({'error': 'App not found'}), 404
        
        # Add app to workspace
        workspace_service.add_app_to_workspace(workspace_code, app_code)
        
        # Initialize app in workspace
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        app_service.initialize_app_in_workspace(workspace_db, app_code)
        
        return jsonify({'message': f'App {app_code} installed in workspace'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500