import 'package:flutter/material.dart';
import 'package:moto/core/utils/colors.dart';
import 'package:moto/rider/notification/widgets/notification_card.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification_model.dart';
import '../services/notification_service.dart';
import 'notification_detail_screen.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final NotificationService _notificationService = NotificationService();
  final ScrollController _scrollController = ScrollController();
  String? _token;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  List<NotificationModel> _notifications = [];
  int _currentPage = 1;
  int _totalPages = 1;
  String? _error;
  int _selectedFilterIndex = 0;

  void initState() {
    super.initState();
    _loadTokenAndFetch();
    _scrollController.addListener(_onScroll);
  }

  Future<void> _loadTokenAndFetch() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    setState(() {
      _token = token;
    });
    if (_token != null) {
      await _fetchInitialNotifications();
    } else {
      setState(() {
        _error = 'Authentication token not found. Please log in again.';
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent * 0.9 &&
        !_isLoadingMore &&
        _currentPage < _totalPages) {
      _fetchMoreNotifications();
    }
  }

  Future<void> _fetchInitialNotifications() async {
    setState(() {
      _isLoading = true;
      _notifications = [];
      _currentPage = 1;
      _error = null;
    });
    if (_token == null) {
      //
      setState(() {
        //
        _error = 'Authentication token is missing.'; //
        _isLoading = false; //
      });
      return; //
    }

    try {
      final response = await _notificationService.getNotifications(
        token: _token!,
        page: 1,
        unreadOnly: _selectedFilterIndex == 1,
      );
      setState(() {
        _notifications = response.items;
        _currentPage = response.pagination.page;
        _totalPages = response.pagination.totalPages;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchMoreNotifications() async {
    if (_token == null) {
      //
      setState(() {
        //
        _error = 'Authentication token is missing.'; //
        _isLoadingMore = false; //
      });
      return; //
    }
    setState(() {
      _isLoadingMore = true;
    });

    try {
      final response = await _notificationService.getNotifications(
        token: _token!,
        page: _currentPage + 1,
        unreadOnly: _selectedFilterIndex == 1,
      );
      setState(() {
        _notifications.addAll(response.items);
        _currentPage = response.pagination.page;
        _isLoadingMore = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoadingMore = false;
      });
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    if (_token == null) {
      //
      ScaffoldMessenger.of(context).showSnackBar(
        //
        const SnackBar(content: Text('Authentication token is missing.')), //
      );
      return; //
    }
    try {
      final success = await _notificationService.markNotificationAsRead(
        notificationId,
        _token!,
      );
      if (success) {
        setState(() {
          final index = _notifications.indexWhere(
            (n) => n.notificationId == notificationId,
          );
          if (index != -1) {
            _notifications[index] = NotificationModel(
              notificationId: _notifications[index].notificationId,
              userId: _notifications[index].userId,
              notificationType: _notifications[index].notificationType,
              messageContent: _notifications[index].messageContent,
              viewed: true, // Update status
              sent: _notifications[index].sent,
              createdAt: _notifications[index].createdAt,
            );
          }
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to mark as read: $e')));
    }
  }

  void _onFilterTapped(int index) {
    if (_selectedFilterIndex != index) {
      setState(() {
        _selectedFilterIndex = index;
      });
      _fetchInitialNotifications();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(120.0),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [ColorsApp().secondaryColor, ColorsApp().primaryColor],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
          ),
          child: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Notifications',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 15),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    FilterChip(
                      label: const Text('All'),
                      selected: _selectedFilterIndex == 0,
                      onSelected: (selected) => _onFilterTapped(0),
                      backgroundColor:
                          _selectedFilterIndex == 0
                              ? Colors.white
                              : Colors.white.withOpacity(0.3),
                      selectedColor: Colors.white,
                    ),
                    const SizedBox(width: 10),
                    FilterChip(
                      label: const Text('Unreadable'),
                      selected: _selectedFilterIndex == 1,
                      onSelected: (selected) => _onFilterTapped(1),
                      backgroundColor:
                          _selectedFilterIndex == 1
                              ? Colors.white
                              : Colors.white.withOpacity(0.3),
                      selectedColor: Colors.white,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(child: Text('ERROR : $_error'));
    }

    if (_notifications.isEmpty) {
      return const Center(child: Text('There are no notifications currently.'));
    }

    return RefreshIndicator(
      onRefresh: _fetchInitialNotifications,
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.all(10),
        itemCount: _notifications.length + (_isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _notifications.length) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: CircularProgressIndicator(),
              ),
            );
          }
          final notification = _notifications[index];
          return NotificationCard(
            notification: notification,
            onTap: () {
              // Mark as read when tapped and then navigate
              if (!notification.viewed) {
                _markAsRead(notification.notificationId);
              }
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder:
                      (context) =>
                          NotificationDetailScreen(notification: notification),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
